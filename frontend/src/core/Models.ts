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
	REPORT_GENERATED = "report-generated",
}

export enum Statuses {
	WAITING_CONNECTION = 0,
	READY = 1,
	GENERATING_QUERIES = 2,
	SEARCHING_WEB = 3,
	SCRAPING_DATA = 4,
	GENERATING_REPORT = 5,
	COMPLETE = 6,
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
