import { createContext, type PropsWithChildren, useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import {
	CustomEvents,
	type GeneratedQueriesOutput,
	type SearchResult,
	type Statuses,
} from "@/core/Models";
import { useResearchState } from "@/state/research.state";
export const WebSocketContext = createContext<Socket | null>(null);

const socket = io("http://localhost:8000/ws", {
	path: "/ws/socket.io",
	transports: ["websocket", "polling"],
});

export default function WebSocketProvider({ children }: PropsWithChildren) {
	const { setQueries, updateStatus, setUrlsToQueries, setReport } = useResearchState(
		useShallow((state) => state),
	);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected to ws");
		});

		socket.on(
			CustomEvents.STATUS_UPDATE,
			({ status }: { status: Statuses }) => {
				updateStatus(status);
			},
		);

		socket.on(
			CustomEvents.QUERIES_GENERATED,
			({ queries }: { queries: GeneratedQueriesOutput }) => {
				setQueries(queries);
			},
		);

		socket.on(
			CustomEvents.URLS_GENERATED,
			({ searchResults }: { searchResults: SearchResult[] }) => {
				setUrlsToQueries(searchResults);
			},
		);

		socket.on(
			CustomEvents.REPORT_GENERATED,
			({ report }: { report: string }) => {
				setReport(report)
			}
		)

		return () => {
			socket.off("connect");
		};
	}, [setQueries, setUrlsToQueries, updateStatus]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
}
