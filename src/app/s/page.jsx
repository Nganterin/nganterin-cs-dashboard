'use client'

import ChatRoom from "@/components/ChatRoom";
import { WS_URL } from "@/utils/environment";
import { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import './styles.css'
import { toast } from "sonner";

const Page = () => {
    const [ws, setWs] = useState(null);
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("");

    const handleNewChat = (data) => {
        localStorage.setItem("last", data.uuid)

        setRooms(prevRooms => {
            const existingRoomIndex = prevRooms.findIndex(room =>
                room.customer_uuid === data.customer.uuid
            );

            let updatedRooms;
            if (existingRoomIndex === -1) {
                updatedRooms = [...prevRooms, {
                    customer_name: data.customer.name,
                    customer_uuid: data.customer.uuid,
                    data: [data]
                }];
            } else {
                updatedRooms = [...prevRooms];
                updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    data: [...updatedRooms[existingRoomIndex].data, data]
                };

                if (selectedRoom && selectedRoom.customer_uuid == data.customer.uuid) {
                    setSelectedRoom(updatedRooms[existingRoomIndex]);
                }
            }

            localStorage.setItem("rooms", JSON.stringify(updatedRooms));
            return updatedRooms;
        });
    };

    useEffect(() => {
        const storedRooms = localStorage.getItem("rooms");
        if (storedRooms) {
            setRooms(JSON.parse(storedRooms));
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        const last = localStorage.getItem("last");
        const socket = new WebSocket(`${WS_URL}/ws/chat?token=${token}&last=${last}`);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setWs(socket);
        };

        socket.addEventListener('ping', (event) => {
            socket.pong();
          });

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            handleNewChat(data)
            toast.success("New message received");
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        socket.onclose = () => {
            toast.error("WebSocket connection closed");
            console.log("WebSocket connection closed");
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="">
            <SplitPane split="vertical" minSize={400} defaultSize={400} maxSize={600} style={{ position: "static" }}>
                <div className="overflow-auto">
                    {rooms.map((item, i) => (
                        <div key={i} className="px-4 py-2 border-b cursor-pointer hover:bg-zinc-800/70"
                            onClick={() => setSelectedRoom(item)}>
                            <p className="font-poppins text-lg font-semibold">
                                {item.customer_name}
                            </p>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm">
                                    {item.data[item.data.length - 1].message}
                                </p>
                                <p className="text-sm">
                                    {item.data[item.data.length - 1].humanized_created_at}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="">
                    <ChatRoom ws={ws} data={selectedRoom} />
                </div>
            </SplitPane>
        </div>
    )
}

export default Page