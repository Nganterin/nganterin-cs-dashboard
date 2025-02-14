'use client'

import ChatRoom from "@/components/ChatRoom";
import { WS_URL } from "@/utils/environment";
import { useEffect, useState, useRef, useCallback } from "react";
import SplitPane from "react-split-pane";
import './styles.css'
import { toast } from "sonner";
import { FormatTime } from "@/utils/time_format";
import Link from "next/link";
import { GearSix, SignOut } from "@phosphor-icons/react";
import UnselectedRoom from "@/components/UnselectedRoom";
import useEscapeToClear from "@/hooks/useEscapeToClear";

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 5000;

const Page = () => {
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const reconnectAttempts = useRef(0);
    const pingInterval = useRef(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const isUnmounting = useRef(false);

    useEscapeToClear(setSelectedRoom)

    const handleNewChat = useCallback((data) => {
        localStorage.setItem("last", data.uuid);

        setRooms((prevRooms) => {
            const existingRoomIndex = prevRooms.findIndex(
                (room) => room.customer_uuid === data.customer.uuid
            );

            let updatedRooms;
            if (existingRoomIndex === -1) {
                updatedRooms = [
                    {
                        customer_name: data.customer.name,
                        customer_uuid: data.customer.uuid,
                        is_unread: true,
                        data: [data],
                    },
                    ...prevRooms,
                ];
            } else {
                updatedRooms = [...prevRooms];
                const updatedRoom = {
                    ...updatedRooms[existingRoomIndex],
                    is_unread: true,
                    data: [...updatedRooms[existingRoomIndex].data, data],
                };

                updatedRooms.splice(existingRoomIndex, 1);

                updatedRooms.unshift(updatedRoom);
            }
            return updatedRooms;
        });
    }, [selectedRoom]);

    useEffect(() => {
        if (rooms.length > 0) {
            localStorage.setItem("rooms", JSON.stringify(rooms));
        }

    }, [rooms])

    const handleSelectRoom = (item) => {
        setSelectedRoom(item);
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.customer_uuid === item.customer_uuid
                    ? { ...room, is_unread: false }
                    : room
            )
        );
    }

    useEffect(() => {
        if (selectedRoom) {
            const updatedRoom = rooms.find(
                (room) => room.customer_uuid === selectedRoom.customer_uuid
            );
            if (updatedRoom) {
                setSelectedRoom(updatedRoom);
            }
        }
    }, [rooms]);

    const connect = useCallback(() => {
        if (isUnmounting.current) return;

        const token = localStorage.getItem("token");
        const last = localStorage.getItem("last");

        if (!token) {
            toast.error("No authentication token found");
            return;
        }

        if (ws.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            ws.current = new WebSocket(`${WS_URL}/ws/chat?token=${token}&last=${last}`);

            ws.current.onopen = () => {
                if (isUnmounting.current) {
                    ws.current?.close();
                    return;
                }
                console.log("WebSocket connected");
                setIsConnected(true);
                reconnectAttempts.current = 0;

                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                    reconnectTimeout.current = null;
                }

                pingInterval.current = setInterval(() => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: "ping" }));
                    }
                }, 30000);
            };

            ws.current.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    handleNewChat(data);
                } catch (err) {
                    console.error("Error processing message:", err);
                    toast.error("Error processing message");
                }
            };

            ws.current.onerror = () => {
                if (isUnmounting.current) return;
                setIsConnected(false);

                if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts.current += 1;
                    connect();
                }
            };

            ws.current.onclose = (event) => {
                if (isUnmounting.current) return;
                console.log("WebSocket connection closed", event);
                setIsConnected(false);

                if (pingInterval.current) {
                    clearInterval(pingInterval.current);
                    pingInterval.current = null;
                }

                if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                    const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);

                    reconnectTimeout.current = setTimeout(() => {
                        reconnectAttempts.current += 1;
                        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
                            console.log(`Reconnection attempt ${reconnectAttempts.current}...`);
                            connect();
                        }
                    }, delay);
                } else {
                    toast.error("Maximum reconnection attempts reached. Please refresh the page.");
                }
            };
        } catch (err) {
            if (!isUnmounting.current) {
                console.error("Error creating WebSocket connection:", err);
                toast.error("Failed to establish connection");
            }
        }
    }, []);


    useEffect(() => {
        try {
            const storedRooms = localStorage.getItem("rooms");
            if (storedRooms) {
                setRooms(JSON.parse(storedRooms));
            }
        } catch (err) {
            console.error("Error loading stored rooms:", err);
            toast.error("Error loading chat history");
        }

        isUnmounting.current = false;
        connect();

        return () => {
            isUnmounting.current = true;
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (pingInterval.current) {
                clearInterval(pingInterval.current);
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <div className="relative h-screen">
            <div
                className={`fixed top-6 right-6 z-50 px-3 py-1 rounded-full text-sm text-white ${isConnected ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-rose-700"
                    }`}
            >
                {isConnected ? "Connected" : "Disconnected"}
            </div>

            <SplitPane
                split="vertical"
                minSize={400}
                defaultSize={400}
                maxSize={600}
                style={{ position: "static" }}
            >
                <div className="h-screen">
                    <div className="h-full overflow-y-scroll">
                        <div className="sticky top-0 bg-slate-900 flex flex-row items-center justify-between p-6 border-b border-slate-700">
                            <p className="font-poppins text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent ">
                                Temenin
                            </p>
                            <div className="flex flex-row justify-center items-center gap-4">
                                <Link href={`/s/settings`} ><GearSix size={20} color="white" /></Link>
                                <Link href={`/s/settings/signout`} ><SignOut size={20} color="white" /></Link>
                            </div>
                        </div>
                        {rooms.map((item, i) => (
                            <div
                                key={i}
                                className={`px-4 py-3 w-full flex flex-row items-center gap-2 cursor-pointer hover:bg-slate-800/70 ${selectedRoom?.customer_uuid === item.customer_uuid ? "bg-slate-800" : ""
                                    }`}
                                onClick={() => handleSelectRoom(item)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    {item.customer_name[0]}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-row items-center justify-between">
                                        <p className="font-poppins text-lg font-semibold">
                                            {item.customer_name}
                                        </p>
                                        {item.is_unread && <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />}
                                    </div>
                                    <div className="flex flex-row w-full justify-between">
                                        <p className={`text-sm truncate max-w-[200px] ${item.is_unread ? "font-semibold" : ""}`}>
                                            {item.data[item.data.length - 1].message}
                                        </p>
                                        <p className="text-xs text-gray-400 whitespace-nowrap pl-2">
                                            {FormatTime(item.data[item.data.length - 1].created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-4 border-b text-center text-xs text-opacity-70 bg-slate-800">
                            End of customers
                        </div>
                    </div>
                </div>
                <div className="h-screen">
                    {selectedRoom === "" ? (
                        <UnselectedRoom />
                    ) : (
                        <ChatRoom
                            ws={ws.current}
                            data={selectedRoom}
                            isConnected={isConnected}
                        />
                    )}
                </div>
            </SplitPane>
        </div>
    );
};

export default Page;