"use client";

import SideBar from "@/components/side-bar/side-bar";
import Chat from "@/components/chat/chat";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IRoom } from "@/hooks/app-store/reducer";
import { useReduxDispatch } from "@/hooks/app-store/store-hook";
import { useAuth } from "@/hooks/auth-hook";
import TopBar from "@/components/top-bar/top-bar";
import { useRouter } from "next/navigation";

const WebChat = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useReduxDispatch();
  const { auth } = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    dispatch({
      type: "loading_room_set",
      payload: {
        room: true
      }
    })

    api.get<IRoom[]>("/load")
      .then(response => {
        dispatch({
          type: "room_first_load",
          payload: {
            rooms: response.data
          }
        });

        if (response.data.length > 0)
          dispatch({ type: "selected_room_set", payload: { selectedRoom: response.data[0].id } })
      })
      .catch(error => console.error(error))
      .finally(() => {
        dispatch({
          type: "loading_room_set",
          payload: {
            room: false,
          }
        });
      })
  }, []);

  useEffect(() => {
    if (auth.status === "unauthenticated")
      push("/auth/sign-in");
  }, [auth]);

  return (
    <div className="p-0 md:p-5 h-full w-full">
      <div className="h-full w-full flex md:rounded-2xl shadow-sm overflow-hidden relative" >
        <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <div className="w-full flex flex-col">
          <TopBar setShowSidebar={setShowSidebar} />
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default WebChat;