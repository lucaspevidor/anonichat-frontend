"use client";

import { IRoom } from "@/hooks/app-store/reducer";
import { useAppState } from "@/hooks/app-store/store-hook";
import { UserPlus, Users, Trash2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/auth-hook";
import AddMemberDialog from "../modals/add-member-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import TopBarTooltip from "./top-bar-tooltip";
import { useModal } from "@/hooks/modal-hook";


const TopBar = () => {
  const appState = useAppState();
  const { auth } = useAuth();
  const { onOpen } = useModal();

  const activeChannel = appState.rooms.find(r => r.id === appState.selectedRoom);

  return (
    <TooltipProvider>
      <div className="flex bg-slate-100 py-2 px-5 justify-between items-center z-10 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-muted-foreground">
            {
              activeChannel?.name || "No channel selected"
            }
          </span>
          {
            activeChannel &&
            <span className="text-sm text-muted-foreground">
              {
                activeChannel.memberIDs.length > 0 ?
                  activeChannel.memberIDs.length === 1 ?
                    "1 member" : `${activeChannel.memberIDs.length} members` :
                  "No members"
              }
            </span>
          }
        </div>
        {
          activeChannel &&
          <div className="flex gap-4">
            {
              auth.id === activeChannel?.ownerId ?
                <>
                  <TopBarTooltip content="Add a member">
                    <Button variant="ghost" className="p-0" onClick={() => onOpen("addMember", { roomId: activeChannel.id })}>
                      <UserPlus className="mr-2 h-5 w-5 text-slate-500" />
                    </Button>
                  </TopBarTooltip>
                  <TopBarTooltip content="Manage members">
                    <Button variant="ghost" className="p-0" onClick={() => onOpen("manageMembers", { roomId: activeChannel.id, manageMembers: true })}>
                      <Users className="mr-2 h-5 w-5 text-slate-500" />
                    </Button>
                  </TopBarTooltip>
                  <TopBarTooltip content="Delete channel">
                    <Button variant="ghost" className="p-0" onClick={() => onOpen("deleteChannel", { roomId: activeChannel.id })}>
                      <Trash2 className="mr-2 h-5 w-5 text-destructive" />
                    </Button>
                  </TopBarTooltip>
                </> :
                <>
                  <TopBarTooltip content="View members">
                    <Button variant="ghost" className="p-0" onClick={() => onOpen("manageMembers", { roomId: activeChannel.id, manageMembers: false })}>
                      <Users className="mr-2 h-5 w-5 text-slate-500" />
                    </Button>
                  </TopBarTooltip>
                  <TopBarTooltip content="Leave channel">
                    <Button variant="ghost" className="p-0" onClick={() => onOpen("leaveChannel", { roomId: activeChannel.id })}>
                      <LogOut className="mr-2 h-5 w-5 text-destructive" />
                    </Button>
                  </TopBarTooltip>
                </>
            }
          </div>
        }
      </div>
    </TooltipProvider>
  );
}

export default TopBar;