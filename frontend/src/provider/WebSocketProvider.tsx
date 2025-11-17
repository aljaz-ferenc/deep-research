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
	type GuardrailDecision,
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

const socket = io("http://localhost:8000", {
    path: "/ws/socket.io",
    transports: ["websocket", "polling"],
});

export default function WebSocketProvider({ children }: PropsWithChildren) {
	const {
		setQueries,
		updateStatus,
		setUrlsToQueries,
		setReport,
		setError,
		setInputDecision,
	} = useResearchState(useShallow((state) => state));

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
			({ reportId }: { reportId: string }) => {
				setReport(reportId);
			},
		);

		socket.on(CustomEvents.ERROR, ({ error }: { error: string }) => {
			setError(error);
		});

		socket.on(
			CustomEvents.GUARDRAIL_DECISION,
			(decision: GuardrailDecision) => {
				setInputDecision(decision);
			},
		);

		return () => {
			socket.off("disconnect");
		};
	}, [
		setQueries,
		setUrlsToQueries,
		updateStatus,
		setError,
		handleDisconnect,
		setInputDecision,
		setReport,
	]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
}
