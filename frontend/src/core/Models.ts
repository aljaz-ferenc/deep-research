import z from "zod";

export const querySchema = z.string().min(3, {
	message: "Min 3 characters",
});

export type Query = z.infer<typeof querySchema>;

export enum CustomEvents {
	QUERY = "query",
	STATUS_UPDATE = "status-update",
	QUERIES_GENERATED = "queries-generated",
	URLS_GENERATED = "urls-generated",
	REPORT_GENERATED = "report-generated"
}

export enum Statuses {
	READY = 0,
	GENERATING_QUERIES = 1,
	SEARCHING_WEB = 2,
	SCRAPING_DATA = 3,
	GENERATING_REPORT = 4,
	COMPLETE = 5
}

export type GeneratedQuery = {
	query: string;
	id: number;
	url?: string;
};

export type GeneratedQueriesOutput = {
	queries: GeneratedQuery[];
	explanation: string;
};

// export type GeneratedQueryWithUrl = {
// 	url: string
// } & GeneratedQuery

export type SearchResult = {
	query_id: number;
	url: string;
};
