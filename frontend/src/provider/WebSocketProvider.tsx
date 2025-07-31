import { CustomEvents, Statuses } from "@/core/Models";
import { createContext, type PropsWithChildren, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export const WebSocketContext = createContext<Socket | null>(null);

const socket = io("http://localhost:8000/ws", {
    path: "/ws/socket.io",
    transports: ["websocket", "polling"],
});

export default function WebSocketProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        socket.on("connect", () => {
            console.log('connected to ws')
        });

        socket.on('greeting', data => {
            console.log('DATA: ', data)
        })

        socket.on(CustomEvents.STATUS_UPDATE, (data: { status: Statuses }) => {
            console.log('STATUS_UPDATE: ', data)
        })

        socket.on(CustomEvents.QUERIES_GENERATED, (data: { queries: Array<string> }) => {
            console.log('GENERATED_QUERIES: ', data)
        })

        return () => {
            socket.off("connect");
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}</WebSocketContext.Provider>
    );
}
