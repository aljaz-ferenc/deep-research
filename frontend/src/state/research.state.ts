import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	type GeneratedQueriesOutput,
	type GuardrailDecision,
	type SearchResult,
	Statuses,
} from "@/core/Models";

type ResearchStore = {
	status: Statuses;
	queries: GeneratedQueriesOutput | null;
	report: string;
	model: string;
	error: string;
	inputDecision: GuardrailDecision | null,
	updateStatus: (status: Statuses, model: string) => void;
	setQueries: (queries: GeneratedQueriesOutput) => void;
	setUrlsToQueries: (searchResults: SearchResult[]) => void;
	setReport: (report: string) => void;
	resetStore: () => void;
	setError: (error: string) => void;
	setInputDecision: (inputDecision: GuardrailDecision) => void
};

export const useResearchState = create<ResearchStore>()(
	persist(
		(set, getState) => ({
			status: Statuses.WAITING_CONNECTION,
			queries: null,
			report: "",
			model: "",
			error: "",
			inputDecision: null,
			updateStatus: (status, model) => set({ status, model }),
			setQueries: (queries) => set({ queries }),
			setUrlsToQueries: (searchResults) => {
				set((state) => {
					if (!state.queries) return state;

					const queries = state.queries.queries.map((q) => {
						const match = searchResults.find((r) => r.query_id === q.id);
						return { ...q, url: match?.url };
					});
					const explanation = state.queries?.explanation;

					return {
						...state,
						queries: {
							explanation,
							queries,
						},
					};
				});
			},
			setReport: (report) => set({ report }),
			resetStore: () =>
				set({
					...getState(),
					status: Statuses.READY,
					queries: null,
					report: "",
					model: "",
					error: "",
					inputDecision: null
				}),
			setError: (error) => set({ error }),
			setInputDecision: (inputDecision) => set({inputDecision}),
		}),
		{
			name: "research-storage",
		},
	),
);
