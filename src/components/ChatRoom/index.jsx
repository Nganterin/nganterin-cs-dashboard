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
        <div className="h-screen flex flex-col pb-3">
            <div className="p-6 border-b border-slate-700 mb-3">
                <p className="text-lg font-bold">
                    {data.customer_name}
                </p>
            </div>
            <div ref={chatContainerRef} className="flex-grow space-y-4 overflow-auto px-8 pb-2">
                {
                    data?.data?.map((item, index) => {
                        return (
                            <ChatBubble key={index} data={item} />
                        )
                    })
                }
            </div>
            <div className="bg-slate-900 h-max w-full sticky bottom-0 flex flex-row items-center gap-4 px-8 py-3">
                <form onSubmit={sendMessage} className="w-full flex flex-row items-start gap-4 ">
                    <Input classNames={{
                        inputWrapper: ["bg-gradient-to-br", "from-slate-700", "to-slate-800"]
                    }} value={message} onChange={(e) => setMessage(e.target.value)} className="flex-grow" size="lg" />
                    <Button className="bg-gradient-to-br from-slate-700 to-slate-800" type="submit" size="lg"><PaperPlaneTilt size={26} /></Button>
                </form>
            </div>
        </div>
    )
}

export default ChatRoom;