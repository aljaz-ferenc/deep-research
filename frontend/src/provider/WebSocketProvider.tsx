import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useEffect,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import {
	CustomEvents,
	type GeneratedQueriesOutput,
	type SearchResult,
	Statuses,
} from "@/core/Models";
import { useResearchState } from "@/state/research.state";
export const WebSocketContext = createContext<Socket | null>(null);

const socket = io("http://localhost:8000/ws", {
	path: "/ws/socket.io",
	transports: ["websocket", "polling"],
	reconnection: false,
});

export default function WebSocketProvider({ children }: PropsWithChildren) {
	const { setQueries, updateStatus, setUrlsToQueries, setReport, setError } =
		useResearchState(useShallow((state) => state));

	const attemptReconnect = useCallback(() => {
		const interval = setInterval(() => {
			console.log("trying to reconnect...");
			socket.connect();
		}, 3000);

		socket.on("connect", () => {
			console.log("reconnected");
			clearInterval(interval);
		});
	}, []);

	const handleDisconnect = useCallback(() => {
		console.log("disconnected");
		updateStatus(Statuses.WAITING_CONNECTION, "");
		attemptReconnect();
	}, [updateStatus, attemptReconnect]);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected to ws");
		});

		socket.on("disconnect", handleDisconnect);

		socket.on(
			CustomEvents.STATUS_UPDATE,
			({ status, model }: { status: Statuses; model: string }) => {
				updateStatus(status, model);
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
				setReport(report);
			},
		);

		socket.on(CustomEvents.ERROR, ({ error }: { error: string }) => {
			setError(error);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect", handleDisconnect);
		};
	}, [
		setQueries,
		setUrlsToQueries,
		updateStatus,
		setReport,
		handleDisconnect,
		setError,
	]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
}
