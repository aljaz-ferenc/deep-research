import { useMutation, useQueryClient } from "@tanstack/react-query";
import Endpoints from "@/core/Endpoints.ts";

async function fetchDeleteReport(
	reportId: string,
): Promise<{ message: string; reportId: string }> {
	const res = await fetch(`${Endpoints.reports}/${reportId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error("Could not delete the report.");
	}
	return await res.json();
}

export default function useDeleteReport() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["delete-report"],
		mutationFn: async (reportId: string) => fetchDeleteReport(reportId),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
	});
}
