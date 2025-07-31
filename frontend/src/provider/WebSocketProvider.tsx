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

        return () => {
            socket.off("connect");
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}</WebSocketContext.Provider>
    );
}
