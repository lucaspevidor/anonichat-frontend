"use client";

import { useAuth } from "@/hooks/auth-hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

import "./s-side-bar.css";
import { cn } from "@/lib/utils";


interface Room {
  id: string,
  name: string,
  memberIDs: string[]
  ownerId: string
}

const SideBar = (
  {
    selectedRoom,
    setSelectedRoom
  } : {
    selectedRoom: string,
    setSelectedRoom: React.Dispatch<React.SetStateAction<string>>
  }
) => {

  const {auth} = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    setLoadingRooms(true);

    api.get<Room[]>("/room/list")
      .then(response => {
        setRooms(response.data);
        if (response.data.length > 0) setSelectedRoom(response.data[0].id);
        setLoadingRooms(false);
      })
      .catch(error => {
        console.log(error);
        setLoadingRooms(false);
      });
  }, []);

  return ( 
    <div className="flex flex-col h-full bg-slate-100 max-w-[20rem] min-w-[20rem] z-20 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col p-5">
        <span className="text-2xl font-semibold text-slate-800">AnonChat</span>
        <span className="text-muted-foreground">Welcome, {auth?.username}</span>
      </div>
      <div className="border-t-2 py-5">
        <span className="text-muted-foreground ml-5">Channels</span>
        <ScrollArea className="mt-2 overflow-hidden">
          {rooms.map((room) => (
            <button className={cn("flex gap-4 px-5 items-center py-2 w-full roomListItem", room.id === selectedRoom && "selectedRoom")} key={room.id} onClick={() => setSelectedRoom(room.id)}>
                <div className="flex justify-center items-center w-8 h-8 bg-slate-200 roomListThumb">
                  <span className="text-muted-foreground">{room.name[0].toUpperCase()}</span>
                </div>
                <span className="text-slate-800">{room.name}</span>
            </button>
          ))}
        </ScrollArea>
      </div>
    </div> 
  );
}
 
export default SideBar;