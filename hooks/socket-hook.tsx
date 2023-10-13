"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {io, type Socket} from "socket.io-client";
import { useReduxDispatch } from "./app-store/store-hook";
import { useAuth } from "./auth-hook";
import { IMessage } from "./app-store/reducer";

interface ISocketContext {
  socket: Socket | null
}

const socketContext = createContext<ISocketContext | null>(null);

export function SocketProvider({children}:{children: React.ReactNode}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useReduxDispatch();
  const { auth } = useAuth();

  useEffect(() => {
    if (socket === null) {
      setSocket(io("ws://localhost:3001"));
    } else {
      socket.on("connect", () => {
        console.log(`Socket ${socket.id} is connected`)

        socket.emit("begin", auth.id, auth.jwt);
      });

      socket.on("room-created", (room) => {
        console.log("New room has been created", {room});

        dispatch({
          type: "room_added",
          payload: {
            room: room
          }
        })
      })

      socket.on("new-message", (message: IMessage) => {
        console.log(`New message has been received`, {message});

        dispatch({
          type: "message_added",
          payload: {
            message: message
          }
        })
      })
    }

    return () => {      
      socket?.disconnect();
    }
  }, [socket]);

  return (
    <socketContext.Provider value={{socket}}>
      {children}
    </socketContext.Provider>
  )
}

export function useSocket() {
  const ctx = useContext(socketContext);
  if (ctx === null)
    throw new Error("useSocket must be within a SocketProvider");

  return ctx;
}