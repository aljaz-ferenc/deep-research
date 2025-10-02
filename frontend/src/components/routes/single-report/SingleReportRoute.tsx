import { useRef } from "react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { PageSpinner } from "@/components/routes/home/StepItem.tsx";
import useReport from "@/hooks/api/useReport.ts";

export default function SingleReportRoute() {
	const { data: report, isLoading, isError } = useReport();
	const reportRef = useRef<HTMLDivElement>(null);

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
				<div ref={reportRef}>
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
				</div>
			</div>
		</main>
	);
}
