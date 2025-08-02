import { create } from "zustand";
import {
	type GeneratedQueriesOutput,
	type SearchResult,
	Statuses,
} from "@/core/Models";
import {createJSONStorage, persist} from 'zustand/middleware'

type ResearchStore = {
	status: Statuses;
	queries: GeneratedQueriesOutput | null;
	report: string,
	updateStatus: (status: Statuses) => void;
	setQueries: (queries: GeneratedQueriesOutput) => void;
	setUrlsToQueries: (searchResults: SearchResult[]) => void;
	setReport: (report: string) => void
};

export const useResearchState = create<ResearchStore>()(
	persist(
	  (set) => ({
		status: Statuses.READY,
		queries: null,
		report: '',
		updateStatus: (status) => set({ status }),
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
		name: 'research-storage',
	  }
	)
  );
