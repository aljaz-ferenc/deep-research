import { useMutation } from "react-query";
import Endpoints from "@/core/Endpoints";
import type { Query } from "@/core/Models";

async function fetchStartResearch(query: string): Promise<Query> {
	const res = await fetch(Endpoints.research, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});
	return await res.json();
}

export default function useStartResearch() {
	return useMutation({
		mutationKey: ["send-query"],
		mutationFn: async (query: Query) => await fetchStartResearch(query),
	});
}
