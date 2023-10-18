import ModalProvider from "@/components/modals/modal-provider";
import { SocketProvider } from "@/hooks/socket-hook";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <ModalProvider />
      {children}
    </SocketProvider>
  );
}

export default ChatLayout;