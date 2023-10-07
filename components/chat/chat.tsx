import { api } from "@/services/api";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import {AxiosError} from "axios";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/hooks/auth-hook";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface IChatProps {
  selectedRoom: string,
}

interface IMessage {
  "id": string,
  "senderName": string,
  "content": string,
  "roomId": string,
  "createdAt": string,
}

const Chat = ({selectedRoom}: IChatProps) => {
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");

  const {auth} = useAuth();

  useEffect(() => {
    setLoadingMsg(true);
    
    api.get<IMessage[]>(`/messages/${selectedRoom}`)
      .then(response => setMessages(response.data))
      
      .catch(error => {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.error);
        } else {
          console.log(error);
        }
      })
      
      .finally(() => {
        setLoadingMsg(false);
      })
  }, [selectedRoom]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (message.trim() === "" || selectedRoom === "")
      return;

    setSendingMsg(true);
    api.post<IMessage>(`/messages/${selectedRoom}`, {content: message})
      .then(response => {
        console.log(response.data);
        setMessage("");
      })
      .catch(error => console.log(error))
      .finally(() => setSendingMsg(false));
  }

  return ( 
    <div className="flex flex-col justify-center items-center bg-slate-200 w-full">
      {
        loadingMsg ?
        <PulseLoader color="#94a3b8" className=""/> :
        <>
          <ScrollArea className="w-full h-full px-5 pt-2">
            <div className="flex flex-col gap-4 scroll-smooth">
            {messages.map(msg => (
              <div key={msg.id} 
                className={cn("flex flex-row flex-1 max-w", msg.senderName === auth?.username && "justify-end")}
              >
                <div 
                  className={cn("flex flex-col px-2 py-1 rounded-lg shadow-lg max-w-[40%]",
                    msg.senderName === auth?.username ? "bg-emerald-500" : "bg-slate-400")}
                >
                  <span className="text-xs font-semibold text-slate-200">{msg.senderName}</span>
                  <span className="text-slate-50">{msg.content}</span>
                  <span className="text-xs text-slate-200 text-end">{moment(Date.parse(msg.createdAt)).format("HH:mm")}</span>
                </div>
              </div>
            ))}
            </div>
          </ScrollArea>
          <div className="w-full p-2">
            <form className="flex gap-2" onSubmit={(e) => onSubmit(e)}>
              <Input type="text" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
              <Button type="submit" disabled={sendingMsg || message===""} className="bg-slate-800 w-20 transition-all">
                {
                  sendingMsg ?
                    <PulseLoader color="#fff" size={6} /> :
                    "Send"
                }
              </Button>
            </form>
          </div>
        </>
      }
    </div>
   );
}
 
export default Chat;