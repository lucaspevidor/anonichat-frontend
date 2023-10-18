"use client";

import { useEffect, useState } from "react";
import AddMemberDialog from "./add-member-dialog";
import DeleteChannelDialog from "./delete-channel-dialog";
import ManageMembersDialog from "./manage-members-dialog";
import LeaveChannelDialog from "./leave-channel-dialog";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return null;

  return (
    <>
      <AddMemberDialog />
      <DeleteChannelDialog />
      <ManageMembersDialog />
      <LeaveChannelDialog />
    </>
  );
}

export default ModalProvider;