import { useQuery } from "@tanstack/react-query";
import Endpoints from "@/core/Endpoints.ts";
import type { Report } from "@/core/Models.ts";

async function fetchReports(): Promise<Report[]> {
	const res = await fetch(Endpoints.reports);
	if (!res.ok) {
		throw new Error("Could not get reports.");
	}
	const data: Report[] = await res.json();
	return data;
}

export default function useReports() {
	return useQuery<Report[]>({
		queryKey: ["reports"],
		queryFn: fetchReports,
	});
}
