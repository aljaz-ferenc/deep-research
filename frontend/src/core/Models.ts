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
	ERROR = "error",
	GUARDRAIL_DECISION="guardrail-decision"
}

export enum Statuses {
	WAITING_CONNECTION = 0,
	READY = 1,
	VERIFYING_INPUT = 2,
	GENERATING_QUERIES = 3,
	SEARCHING_WEB = 4,
	SCRAPING_DATA = 5,
	GENERATING_REPORT = 6,
	COMPLETE = 7,
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

export type SearchResult = {
	query_id: number;
	url: string;
};

export type GuardrailDecision = {
	is_input_valid: boolean
	reasoning: string
}