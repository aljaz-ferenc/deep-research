import { useQuery } from "@tanstack/react-query";
import Endpoints from "@/core/Endpoints.ts";

type ReportLimit = {
	limit: number;
	used: number;
	remaining: number;
};

async function fetchReportLimit() {
	const res = await fetch(`${Endpoints.reports}/limit`);

	if (!res.ok) {
		throw new Error("Could not get report limit.");
	}
	const data = await res.json();
	console.log(data);
	return data;
}

export function useReportLimit() {
	return useQuery<ReportLimit>({
		queryKey: ["limit"],
		queryFn: fetchReportLimit,
	});
}
