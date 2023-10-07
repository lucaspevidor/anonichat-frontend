"use client";

import SideBar from "@/components/side-bar/side-bar";
import Chat from "@/components/chat/chat";
import { useState } from "react";

const WebChat = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  return ( 
    <div className="p-5 h-full w-full">
      <div className="h-full w-full flex rounded-2xl overflow-hidden shadow-sm" >
        <SideBar selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        <Chat selectedRoom={selectedRoom}/>
      </div>
    </div> 
  );
}
 
export default WebChat;