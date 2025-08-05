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

const BASE_URL =
	process.env.NODE_ENV === "development"
		? import.meta.env.VITE_BASE_URL_DEV
		: import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
	console.error("BASE_URL environment variable missing");
}

export const WebSocketContext = createContext<Socket | null>(null);

const socket = io(`${BASE_URL}/ws`, {
	path: "/ws/socket.io",
	transports: ["websocket", "polling"],
});

export default function WebSocketProvider({ children }: PropsWithChildren) {
	const { setQueries, updateStatus, setUrlsToQueries, setReport, setError } =
		useResearchState(useShallow((state) => state));

	const handleDisconnect = useCallback(() => {
		updateStatus(Statuses.WAITING_CONNECTION, "");
	}, [updateStatus]);

	useEffect(() => {
		if (socket.connected) return;
		handleDisconnect();
	}, [handleDisconnect]);

	useEffect(() => {
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
			socket.off("disconnect");
		};
	}, [
		setQueries,
		setUrlsToQueries,
		updateStatus,
		setReport,
		setError,
		handleDisconnect,
	]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
}
