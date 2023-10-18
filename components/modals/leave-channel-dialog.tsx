import { useState } from "react";
import { IRoom } from "@/hooks/app-store/reducer"
import { useReduxDispatch } from "@/hooks/app-store/store-hook"
import { api } from "@/services/api"
import axios from "axios"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modal-hook";
import { PulseLoader } from "react-spinners";
import { useAuth } from "@/hooks/auth-hook";

const LeaveChannelDialog = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingReq, setLoadingReq] = useState(false);

  const { auth } = useAuth();
  const { isOpen, data, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "leaveChannel"

  const dispatch = useReduxDispatch();

  function leavelRoom() {
    setLoadingReq(true);
    api.put<IRoom>(`/room/remove-user/${data.roomId}/${auth.id}`)
      .then(response => {
        if (auth.id === null)
          throw new Error("Invalid user id");
        dispatch({
          type: "user_removed_from_room",
          payload: {
            roomId: response.data.id,
            userId: auth.id
          }
        })
        handleClose();
      })
      .catch(error => {
        if (axios.isAxiosError(error) && error.response?.data.error) {
          setErrorMsg(error.response?.data.error);
        } else {
          setErrorMsg("Unknown error");
        }
      })
      .finally(() => setLoadingReq(false));
  }

  function handleClose() {
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Leave channel?</DialogTitle>
          <DialogDescription>You won&apos;t be able to access it until someone adds you back.</DialogDescription>
        </DialogHeader>
        <p>
          {
            errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>
          }
        </p>
        <DialogFooter>
          <Button variant="destructive" className="w-20" onClick={() => leavelRoom()}>
            {
              loadingReq ?
                <PulseLoader color="#fff" size={6} /> :
                "Leave"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveChannelDialog;