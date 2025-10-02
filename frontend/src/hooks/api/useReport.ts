import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Endpoints from "@/core/Endpoints.ts";
import type { Report } from "@/core/Models.ts";

async function fetchReport(reportId: string): Promise<Report> {
	const res = await fetch(`${Endpoints.reports}/${reportId}`);
	if (!res.ok) {
		throw new Error("Could not get reports.");
	}
	const data: Report = await res.json();
	return data;
}

export default function useReport() {
	const { reportId } = useParams();
	return useQuery<Report>({
		queryKey: ["reports", { reportId }],
		queryFn: async () => await fetchReport(reportId as string),
		enabled: !!reportId,
	});
}
