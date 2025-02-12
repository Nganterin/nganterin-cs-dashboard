import { Button, Input } from "@heroui/react";
import { ChatBubble } from "../ChatBubble";
import { useState, useEffect, useRef } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { toast } from "sonner";

const ChatRoom = ({ data, ws }) => {
    const [message, setMessage] = useState("");
    const chatContainerRef = useRef(null);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            toast.error("WebSocket not connected");
            return;
        }

        const payload = JSON.stringify({
            customer_uuid: data.customer_uuid,
            message: message
        });
        ws.send(payload);
        setMessage("");
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [data.data]);

    return (
        <div className="h-[calc(100vh-81px)] flex flex-col py-3">
            <div ref={chatContainerRef} className="flex-grow space-y-4 overflow-auto px-8 pb-2">
                {
                    data?.data?.map((item, index) => {
                        return (
                            <ChatBubble key={index} data={item} />
                        )
                    })
                }
            </div>
            <div className="bg-black h-max w-full sticky bottom-0 flex flex-row items-center gap-4 px-8 py-3">
                <form onSubmit={sendMessage} className="w-full flex flex-row items-start gap-4 ">
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} className="w-[calc(100%-200px)]" size="lg" />
                    <Button type="submit" size="lg"><PaperPlaneTilt size={26} /></Button>
                </form>
            </div>
        </div>
    )
}

export default ChatRoom;