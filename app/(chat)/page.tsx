"use client";

import SideBar from "@/components/side-bar/side-bar";
import Chat from "@/components/chat/chat";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IRoom } from "@/hooks/app-store/reducer";
import { useReduxDispatch } from "@/hooks/app-store/store-hook";

const WebChat = () => {
  const dispatch = useReduxDispatch();

  useEffect(() => {    
    api.get<IRoom[]>("/load")
      .then(response => {
        dispatch({
          type: "room_first_load",
          payload: {
            rooms: response.data
          }
        });

        if (response.data.length > 0)
          dispatch({type: "selected_room_set", payload: {selectedRoom: response.data[0]}})
      })
    .catch(error => console.error(error));
  }, []);

  return ( 
    <div className="p-5 h-full w-full">
      <div className="h-full w-full flex rounded-2xl overflow-hidden shadow-sm" >
        <SideBar />
        <Chat />
      </div>
    </div> 
  );
}
 
export default WebChat;