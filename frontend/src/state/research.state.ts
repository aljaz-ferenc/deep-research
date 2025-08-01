import { Statuses, type GeneratedQuery, type SearchResult } from '@/core/Models'
import {create} from 'zustand'

type ResearchStore = {
    status: Statuses,
    queries: GeneratedQuery[],
    updateStatus: (status: Statuses) => void,
    setQueries: (queries: GeneratedQuery[]) => void,
    setUrlsToQueries: (searchResults: SearchResult[]) => void
}

export const useResearchState = create<ResearchStore>((set) => ({
    status: Statuses.READY,
    queries: [],
    updateStatus: (status) => set({status}),
    setQueries: (queries) => set({queries}),
    setUrlsToQueries: (searchResults) => {
        set(state => ({
            queries: state.queries.map(q => {
              const match = searchResults.find(r => r.query_id === q.id);
              return {
                ...q,
                url: match?.url
              }
            })
          }))
    },
})) 