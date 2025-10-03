import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/AppButton.tsx";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import type { Report } from "@/core/Models.ts";
import useDeleteReport from "@/hooks/api/useDeleteReport.ts";
import { cn } from "@/lib/utils.ts";

type ReportListItemProps = {
	report: Report;
};

export default function ReportListItem({ report }: ReportListItemProps) {
	const { mutateAsync: deleteReport, isPending } = useDeleteReport();
	return (
		<ContextMenu>
			<ContextMenuTrigger className={cn([isPending && "opacity-25"])}>
				<div className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
					<div className="flex-grow">
						<p className="font-medium text-zinc-900 dark:text-white">
							{report.title}
						</p>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Generated on: {new Date(report.createdAt).toLocaleDateString()}
						</p>
					</div>
					<Link
						to={`/reports/${report._id}`}
						type="button"
						className={buttonVariants({ intent: "outline" })}
					>
						<span>View Report</span>
						<ArrowRight size={15} />
					</Link>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onClick={() => deleteReport(report._id)}>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export function ReportListItemSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
			<div className="flex-grow space-y-2">
				<Skeleton className="w-[70%] h-[1.5em] rounded" />
				<Skeleton className="w-[30%] h-[1em] rounded" />
			</div>
			<Skeleton className="h-10 w-40" />
		</div>
	);
}
