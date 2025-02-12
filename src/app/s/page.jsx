'use client'

import ChatRoom from "@/components/ChatRoom";
import { WS_URL } from "@/utils/environment";
import { useEffect, useState, useRef, useCallback } from "react";
import SplitPane from "react-split-pane";
import './styles.css'
import { toast } from "sonner";

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 5000;

const Page = () => {
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const reconnectAttempts = useRef(0);
    const pingInterval = useRef(null); // Ref to store the ping interval ID
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const isUnmounting = useRef(false); // Track component unmounting

    // Handle new chat messages
    const handleNewChat = useCallback((data) => {
        localStorage.setItem("last", data.uuid);

        setRooms((prevRooms) => {
            const existingRoomIndex = prevRooms.findIndex(
                (room) => room.customer_uuid === data.customer.uuid
            );

            let updatedRooms;
            if (existingRoomIndex === -1) {
                updatedRooms = [
                    ...prevRooms,
                    {
                        customer_name: data.customer.name,
                        customer_uuid: data.customer.uuid,
                        data: [data],
                    },
                ];
            } else {
                updatedRooms = [...prevRooms];
                updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    data: [...updatedRooms[existingRoomIndex].data, data],
                };

                if (selectedRoom && selectedRoom.customer_uuid === data.customer.uuid) {
                    setSelectedRoom(updatedRooms[existingRoomIndex]);
                }
            }

            localStorage.setItem("rooms", JSON.stringify(updatedRooms));
            return updatedRooms;
        });
    }, [selectedRoom]);

    // WebSocket connection logic
    const connect = useCallback(() => {
        if (isUnmounting.current) return; // Don't connect if unmounting

        const token = localStorage.getItem("token");
        const last = localStorage.getItem("last");

        if (!token) {
            toast.error("No authentication token found");
            return;
        }

        // Close existing connection if it's still open
        if (ws.current?.readyState === WebSocket.OPEN) {
            return; // Don't reconnect if already connected
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
                reconnectAttempts.current = 0; // Reset reconnection attempts

                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                    reconnectTimeout.current = null;
                }

                // Start the ping interval
                pingInterval.current = setInterval(() => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: "ping" }));
                    }
                }, 30000); // Send ping every 30 seconds
            };

            ws.current.onmessage = (e) => {
                if (isUnmounting.current) return;
                try {
                    const data = JSON.parse(e.data);
                    handleNewChat(data);
                } catch (err) {
                    console.error("Error processing message:", err);
                    toast.error("Error processing message");
                }
            };

            ws.current.onerror = (err) => {
                if (isUnmounting.current) return;
                console.error("WebSocket error:", err);
                setIsConnected(false);

                // Attempt to reconnect immediately on error
                if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts.current += 1;
                    connect();
                }
            };

            ws.current.onclose = (event) => {
                if (isUnmounting.current) return;
                console.log("WebSocket connection closed", event);
                setIsConnected(false);

                // Clear the ping interval
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
    }, [handleNewChat]);

    // Initialize WebSocket connection and load stored rooms
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

        isUnmounting.current = false; // Reset unmounting flag
        connect();

        return () => {
            isUnmounting.current = true; // Set unmounting flag
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
    }, [connect]);

    return (
        <div className="relative h-screen">
            <div
                className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm text-white ${isConnected ? "bg-green-500" : "bg-rose-700"
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
                <div className="overflow-auto h-screen">
                    {rooms.map((item, i) => (
                        <div
                            key={i}
                            className={`px-4 py-2 border-b cursor-pointer hover:bg-zinc-800/70 ${selectedRoom?.customer_uuid === item.customer_uuid ? "bg-zinc-800" : ""
                                }`}
                            onClick={() => setSelectedRoom(item)}
                        >
                            <p className="font-poppins text-lg font-semibold">
                                {item.customer_name}
                            </p>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm truncate max-w-[200px]">
                                    {item.data[item.data.length - 1].message}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {item.data[item.data.length - 1].humanized_created_at}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-screen">
                    <ChatRoom
                        ws={ws.current}
                        data={selectedRoom}
                        isConnected={isConnected}
                    />
                </div>
            </SplitPane>
        </div>
    );
};

export default Page;