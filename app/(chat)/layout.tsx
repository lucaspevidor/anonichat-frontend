import { SocketProvider } from "@/hooks/socket-hook";

const ChatLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}
 
export default ChatLayout;