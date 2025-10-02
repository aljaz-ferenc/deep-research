import { Download, Share2 } from "lucide-react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { PageSpinner } from "@/components/routes/home/StepItem.tsx";
import useReport from "@/hooks/api/useReport.ts";

export default function SingleReportRoute() {
	const { data: report, isLoading, isError } = useReport();

	if (isError) {
		return <div>Error...</div>;
	}

	if (isLoading) {
		return <PageSpinner />;
	}

	if (!report) {
		return <div>Error...</div>;
	}

	return (
		<main className="flex-grow justify-center py-8">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-invert">
				<Markdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeSlug]}
					components={{
						a: ({ node, ...props }) => {
							if ((node?.properties.href as string)?.startsWith("https")) {
								return (
									<a target="_blank" className="text-blue-500" {...props} />
								);
							}
							return <a className="text-blue-500" {...props} />;
						},
					}}
				>
					{report.markdown}
				</Markdown>
				<div className="mt-12 flex justify-start gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/80"
					>
						<Download className="mr-2" />
						Download
					</button>
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
					>
						<Share2 className="mr-2" />
						Share
					</button>
				</div>
			</div>
		</main>
	);
}
