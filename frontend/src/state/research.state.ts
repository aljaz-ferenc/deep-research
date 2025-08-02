import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	type GeneratedQueriesOutput,
	type SearchResult,
	Statuses,
} from "@/core/Models";

type ResearchStore = {
	status: Statuses;
	queries: GeneratedQueriesOutput | null;
	report: string;
	model: string;
	updateStatus: (status: Statuses, model: string) => void;
	setQueries: (queries: GeneratedQueriesOutput) => void;
	setUrlsToQueries: (searchResults: SearchResult[]) => void;
	setReport: (report: string) => void;
};

export const useResearchState = create<ResearchStore>()(
	persist(
		(set) => ({
			status: Statuses.WAITING_CONNECTION,
			queries: null,
			report: "",
			model: "",
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
		}),
		{
			name: "research-storage",
		},
	),
);
