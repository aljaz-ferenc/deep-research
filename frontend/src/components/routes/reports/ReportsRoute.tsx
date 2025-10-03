import { Search } from "lucide-react";
import ReportListItem, {
	ReportListItemSkeleton,
} from "@/components/routes/reports/ReportListItem.tsx";
import PageSpinner from "@/components/ui/PageSpinner.tsx";
import ServerError from "@/components/ui/ServerError.tsx";
import useReports from "@/hooks/api/useReports.ts";

export default function ReportsRoute() {
	const { data: reports, isLoading, isError } = useReports();

	if (isLoading) {
		return <PageSpinner />;
	}

	if (isError || !reports) {
		return <ServerError />;
	}

	return (
		<main className="flex-grow">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
							My Reports
						</h1>
						<p className="mt-2 text-zinc-600 dark:text-zinc-400">
							All your research reports in one place.
						</p>
					</div>
					<div className="mb-8 flex flex-col sm:flex-row gap-4">
						<div className="relative flex-grow">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
							<input
								className="pl-10 pr-4 py-3 w-full rounded-lg bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Search reports by topic..."
								type="search"
							/>
						</div>
					</div>
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-zinc-900 dark:text-white px-1">
							Recent Reports
						</h2>
						<div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-background overflow-hidden">
							{isLoading &&
								Array.from({ length: 3 }).map((_skeleton, index) => (
									<ReportListItemSkeleton key={`skeleton-${index + 1}`} />
								))}
							{!isLoading &&
								reports &&
								reports.map((report) => (
									<ReportListItem key={report.title} report={report} />
								))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
