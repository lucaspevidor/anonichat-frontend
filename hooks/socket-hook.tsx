"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useReduxDispatch } from "./app-store/store-hook";
import { useAuth } from "./auth-hook";
import { IMessage, IRoom } from "./app-store/reducer";

interface ISocketContext {
  socket: Socket | null
}

const socketContext = createContext<ISocketContext | null>(null);
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useReduxDispatch();
  const { auth } = useAuth();

  useEffect(() => {
    if (socket === null) {
      setSocket(io(socketUrl));
    } else {
      socket.on("connect", () => {
        socket.emit("begin", auth.id, auth.jwt);
      });

      socket.on("room-created", (room) => {
        socket.emit("begin", auth.id, auth.jwt);

        dispatch({
          type: "room_added",
          payload: {
            room: room
          }
        })
      })

      socket.on("new-message", (message: IMessage) => {
        dispatch({
          type: "message_added",
          payload: {
            message: message
          }
        })
      })

      socket.on("user-added", (userId, username, updatedRoom: IRoom) => {
        dispatch({
          type: "user_added_to_room",
          payload: {
            roomId: updatedRoom.id,
            userId,
          }
        })
      })

      socket.on("user-removed", (userId, updatedRoom: IRoom) => {
        if (userId === auth.id) {
          dispatch({
            type: "room_deleted",
            payload: {
              id: updatedRoom.id,
            }
          })
        }
        else {
          dispatch({
            type: "user_removed_from_room",
            payload: {
              roomId: updatedRoom.id,
              userId,
            }
          })
        }
      })

      socket.on("room-inserted", (updatedRoom: IRoom) => {
        socket.emit("room-inserted-ack", updatedRoom);

        dispatch({
          type: "room_added",
          payload: {
            room: updatedRoom
          }
        })
      })

      socket.on("room-deleted", (deletedRoom: IRoom) => {
        dispatch({
          type: "room_deleted",
          payload: {
            id: deletedRoom.id
          }
        })
      })
    }

    return () => {
      socket?.disconnect();
    }
  }, [socket]);

  return (
    <socketContext.Provider value={{ socket }}>
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