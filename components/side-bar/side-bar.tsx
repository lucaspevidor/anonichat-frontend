"use client";

import { useAuth } from "@/hooks/auth-hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

import "./s-side-bar.css";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import AddChannelDialog from "./add-channel-dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { useAppState, useReduxDispatch } from "@/hooks/app-store/store-hook";
import { IRoom } from "@/hooks/app-store/reducer";

const SideBar = () => {

  const {auth} = useAuth();
  const appState = useAppState();
  const dispatch = useReduxDispatch();

  function setSelectedRoom(room: IRoom) {
    dispatch({
      type: "selected_room_set",
      payload: {
        selectedRoom: room,
      }
    })
  }

  return ( 
    <div className="flex flex-col h-full bg-slate-100 max-w-[20rem] min-w-[20rem] z-20 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col p-5">
        <span className="text-2xl font-semibold text-slate-800">AnonChat</span>
        <span className="text-muted-foreground">Welcome, {auth?.username}</span>
      </div>
      <div className="border-t-2 py-5">
        <div className="flex justify-between px-5 items-center">
          <span className="text-muted-foreground">Channels</span>
          <AddChannelDialog>
            <button className="bg-slate-200 rounded-full w-5 h-5 flex justify-center items-center hover:bg-slate-300 transition-all">
              <Plus className="text-muted-foreground w-4"/>
            </button>
          </AddChannelDialog>
        </div>
        <ScrollArea className="mt-2 overflow-hidden">
          {appState.rooms.map((room) => (
            <ContextMenu key={room.id} >
              <ContextMenuTrigger asChild>
                <button className={cn("flex gap-4 px-5 items-center py-2 w-full roomListItem", room.id === appState.selectedRoom?.id && "selectedRoom")} onClick={() => setSelectedRoom(room)}>
                    <div className="flex justify-center items-center w-8 h-8 bg-slate-200 roomListThumb">
                      <span className="text-muted-foreground">{room.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-slate-800">{room.name}</span>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem>
                  Delete channel
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </ScrollArea>
      </div>
    </div> 
  );
}
 
export default SideBar;