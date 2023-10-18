import { useState } from "react";
import { IRoom } from "@/hooks/app-store/reducer"
import { useReduxDispatch } from "@/hooks/app-store/store-hook"
import { api } from "@/services/api"
import axios from "axios"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modal-hook";
import { PulseLoader } from "react-spinners";

const DeleteChannelDialog = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingReq, setLoadingReq] = useState(false);

  const { isOpen, data, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel"

  const dispatch = useReduxDispatch();

  function removeRoom() {
    setLoadingReq(true);
    api.delete<IRoom>(`/room/${data.roomId}`)
      .then(response => {
        dispatch({
          type: "room_deleted",
          payload: {
            id: response.data.id
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
          <DialogTitle className="text-destructive">Delete channel?</DialogTitle>
          <DialogDescription>All messages will be deleted and cannot be recovered.</DialogDescription>
        </DialogHeader>
        <p>
          {
            errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>
          }
        </p>
        <DialogFooter>
          <Button variant="destructive" className="w-20" onClick={() => removeRoom()}>
            {
              loadingReq ?
                <PulseLoader color="#fff" size={6} /> :
                "Delete"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteChannelDialog;