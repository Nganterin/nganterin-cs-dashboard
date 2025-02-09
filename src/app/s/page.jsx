'use client'

import ChatRoom from "@/components/ChatRoom";
import { WS_URL } from "@/utils/environment";
import { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import './styles.css'

const Page = () => {
    const [ws, setWs] = useState(null);
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("");

    const handleNewChat = (data) => {
        console.log({ data })

        setRooms(prevRooms => {
            const existingRoomIndex = prevRooms.findIndex(room =>
                room.customer_uuid === data.customer_uuid
            );

            if (existingRoomIndex === -1) {
                return [...prevRooms, {
                    customer_name: data.sender_name,
                    customer_uuid: data.customer_uuid,
                    messages: [data]
                }];
            } else {
                const updatedRooms = [...prevRooms];
                updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    messages: [...updatedRooms[existingRoomIndex].messages, data]
                };
                return updatedRooms;
            }
        });
    }

    useEffect(() => {
        console.log({ rooms })
    }, [rooms])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = new WebSocket(`${WS_URL}/ws/chat?token=${token}`);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setWs(socket);
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            handleNewChat(data)
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            toast.error("WebSocket not connected");
            return;
        }

        const payload = JSON.stringify({ message });
        ws.send(payload);
        setMessage("");
    };

    return (
        <div className="">
            <SplitPane split="vertical" minSize={400} defaultSize={300} maxSize={600} style={{ position: "static" }}>
                <div className="overflow-auto bg-gray-100">
                    {rooms.map((item, i) => (
                        <div key={i} className="px-4 py-2 border-b cursor-pointer hover:bg-gray-200"
                            onClick={() => setSelectedRoom(item)}>
                            {item.customer_name}
                        </div>
                    ))}
                </div>
                <div className="">
                    <ChatRoom data={selectedRoom} />
                </div>
            </SplitPane>
        </div>
    )
}

export default Page