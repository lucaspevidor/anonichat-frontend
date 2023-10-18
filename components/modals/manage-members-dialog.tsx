import { useEffect, useState } from "react";
import { IRoom } from "@/hooks/app-store/reducer"
import { useReduxDispatch } from "@/hooks/app-store/store-hook"
import { api } from "@/services/api"
import axios from "axios"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modal-hook";
import { PulseLoader } from "react-spinners";
import { ScrollArea, ScrollViewport } from "../ui/scroll-area";
import { useAuth } from "@/hooks/auth-hook";
import { Trash2 } from "lucide-react";

interface IRoomReadResponse {
  id: string,
  name: string,
  memberIDs: string[],
  ownerId: string,
  members: {
    username: string,
    id: string,
  }[]
}

interface Member {
  id: string,
  username: string,
  loadingReq: boolean,
  removed: boolean,
}

const ManageMembersDialog = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberList, setMemberList] = useState<Member[] | undefined>(undefined);

  const { auth } = useAuth();
  const { isOpen, data, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "manageMembers"
  const manageMode = data.manageMembers;

  const dispatch = useReduxDispatch();

  useEffect(() => {
    if (isModalOpen) {
      setLoadingMembers(true);

      api.get<IRoomReadResponse>(`/room/${data.roomId}`)
        .then(response => {
          setMemberList(response.data.members.map((m) => ({
            id: m.id,
            username: m.username,
            loadingReq: false,
            removed: false,
          })))
        })
        .catch(error => {
          if (axios.isAxiosError(error) && error.response?.data.error) {
            setErrorMsg(error.response.data.message);
          } else {
            setErrorMsg("Unknown error");
          }
        })
        .finally(() => setLoadingMembers(false));
    }
  }, [isModalOpen]);


  function removeMember(member: Member) {
    setMemberList(memberList?.map(m => m.id !== member.id ? m : { ...m, loadingReq: true }))

    api.put<IRoom>(`/room/remove-user/${data.roomId}/${member.id}`)
      .then(response => {
        if (!data.roomId)
          throw new Error("Invalid roomId");

        dispatch({
          type: "user_removed_from_room",
          payload: {
            roomId: data.roomId,
            userId: member.id
          }
        })
        const newMemberList = memberList?.map(m => m.id !== member.id ? m : { ...m, removed: true, loadingReq: false });
        setMemberList(newMemberList)
      })
      .catch(error => {
        if (axios.isAxiosError(error) && error.response?.data.error) {
          setErrorMsg(error.response?.data.error);
        } else {
          setErrorMsg("Unknown error");
        }

        setMemberList(memberList?.map(m => m.id !== member.id ? m : { ...m, loadingReq: false }))
      })
  }

  function handleClose() {
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[325px] bg-slate-100 max-h-[50%] flex flex-col min-h-0">
        <DialogHeader>
          {
            manageMode ?
              <DialogTitle className="text-slate-500">Manage members</DialogTitle> :
              <DialogTitle className="text-slate-500">View members</DialogTitle>
          }
        </DialogHeader>
        {
          loadingMembers ?
            <div className="flex justify-center items-center">
              <PulseLoader color="#64748B" />
            </div> :
            <ScrollArea className="bg-slate-200 rounded-lg p-0 flex flex-col">
              <ScrollViewport className="">
                {
                  memberList &&
                  <ul>
                    {memberList.map(member => (
                      <li key={member.id} className="h-8 flex items-center p-2 border-t-2 first:border-t-0">
                        {
                          member.removed ?
                            <span>Member removed</span> :
                            member.id === auth.id ?
                              <span>{member.username} (You)</span> :
                              <div className="flex items-center justify-between flex-1">
                                <span>{member.username}</span>
                                {
                                  !manageMode ? <></> :
                                    member.loadingReq ?
                                      <PulseLoader color="#EC6566" size={4} /> :
                                      <Button
                                        disabled={member.loadingReq}
                                        variant="link"
                                        className="p-0 w-4 h-4 mr-2 hover:opacity-80 transition-all"
                                        onClick={() => removeMember(member)}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                }
                              </div>
                        }
                      </li>
                    ))}
                  </ul>
                }
              </ScrollViewport>
            </ScrollArea>
        }
      </DialogContent>
    </Dialog>
  );
}

export default ManageMembersDialog;