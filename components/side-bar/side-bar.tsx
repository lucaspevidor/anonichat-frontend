"use client";

import { useAuth } from "@/hooks/auth-hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

import "./s-side-bar.css";
import { cn } from "@/lib/utils";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import AddChannelDialog from "./add-channel-dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { useAppState, useReduxDispatch } from "@/hooks/app-store/store-hook";
import { IRoom } from "@/hooks/app-store/reducer";
import { AxiosError } from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const SideBar = () => {

  const { auth, clearAuth } = useAuth();
  const appState = useAppState();
  const dispatch = useReduxDispatch();
  const { push } = useRouter();

  function setSelectedRoom(room: IRoom) {
    dispatch({
      type: "selected_room_set",
      payload: {
        selectedRoom: room.id,
      }
    })
  }

  function SignOut() {
    clearAuth();
    push("/auth/sign-in");
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 max-w-[20rem] min-w-[20rem] z-20 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center p-5">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-800">AnoniChat</span>
          <span className="text-muted-foreground">Welcome, {auth?.username}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0 m-0">
              <div className="w-12 h-12 rounded-full flex justify-center items-center bg-slate-200">
                <span className="text-2xl text-muted-foreground">{auth.username && auth.username[0].toUpperCase()}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-slate-100">
            <span className="text-lg text-muted-foreground px-4">{auth?.username}</span>
            <Separator className="mb-2" />
            <Button className="flex justify-between w-full bg-transparent hover:bg-slate-200" onClick={() => SignOut()}>
              <span className="text-slate-500">Sign out</span>
              <LogOut className="ml-2 w-4 h-4 text-slate-500" />
            </Button>
            <Button className="flex justify-between w-full bg-transparent hover:bg-slate-200" asChild>
              <Link href="/auth/delete">
                <span className="text-destructive">Delete account</span>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Link>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="border-t-2 py-5 h-full">
        <div className="flex justify-between px-5 items-center">
          <span className="text-muted-foreground">Channels</span>
          <AddChannelDialog>
            <button className="bg-slate-200 rounded-full w-5 h-5 flex justify-center items-center hover:bg-slate-300 transition-all">
              <Plus className="text-muted-foreground w-4" />
            </button>
          </AddChannelDialog>
        </div>
        {
          appState.loading.room ?
            <div className="flex flex-1 justify-center items-center h-full">
              <PulseLoader color="#64748b" size={8} />
            </div> :
            appState.rooms.length === 0 ?
              <div className="flex justify-center items-center h-full w-full flex-1">
                <span className="text-slate-500 text-center">Hmm, there are no channels...<br />Let&apos;s create one!</span>
              </div> :
              <ScrollArea className="mt-2 overflow-hidden">
                {appState.rooms.map((room) => (
                  <button
                    className={cn("flex gap-4 px-5 items-center py-2 w-full roomListItem",
                      room.id === appState.selectedRoom && "selectedRoom")}
                    onClick={() => setSelectedRoom(room)}
                    key={room.id}
                  >
                    <div className="flex justify-center items-center w-8 h-8 bg-slate-200 roomListThumb">
                      <span className="text-muted-foreground">{room.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-slate-800">{room.name}</span>
                  </button>
                ))}
              </ScrollArea>
        }
      </div>
    </div>
  );
}

export default SideBar;