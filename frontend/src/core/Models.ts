import z from "zod";

export const querySchema = z.string().min(3, {
	message: "Min 3 characters",
});

export type Query = z.infer<typeof querySchema>;

export enum CustomEvents {
	QUERY = 'query',
    STATUS_UPDATE = "status-update",
    QUERIES_GENERATED = "queries-generated"
}

export enum Statuses {
	GENERATING_QUERIES = "generating-queries"
}
