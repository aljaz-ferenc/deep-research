import { CheckSquare, SquareX } from "lucide-react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import { Statuses } from "@/core/Models";
import { cn } from "@/lib/utils";
import { useResearchState } from "@/state/research.state";

export default function Process() {
	const { status, queries, error, inputDecision } = useResearchState(
		useShallow((state) => state),
	);

	return (
		<div className="h-full w-full ">
			{status === Statuses.WAITING_CONNECTION && <div>Connecting...</div>}
			{status === Statuses.VERIFYING_INPUT && !inputDecision && (
				<div className="italic font-semibold">Thinking...</div>
			)}
			{inputDecision?.reasoning && (
				<div>
					<h3
						className={cn([
							"flex items-center gap-2",
							inputDecision.is_input_valid ? "text-green-500" : "text-red-500",
						])}
					>
						<span>
							{inputDecision.is_input_valid ? <CheckSquare /> : <SquareX />}
						</span>
						{inputDecision.is_input_valid
							? "Input Check Passed"
							: "Input Invalid"}
					</h3>
					<Markdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>
						{inputDecision?.reasoning}
					</Markdown>
				</div>
			)}
			{queries && (
				<div className="w-full">
					<h3 className="mt-0">Generated queries</h3>
					<ol>
						{queries.queries.map((query, index) => (
							<li key={`query-${index + 1}`}>
								<span>{query.query}</span>
							</li>
						))}
					</ol>
					<h3>Reasoning for generating queries above</h3>
					<Markdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>
						{queries.explanation}
					</Markdown>
					{error && (
						<div>
							<h3 className="text-red-500">Something went wrong:</h3>
							<p>{error}</p>
						</div>
					)}
					{queries.queries.some((q) => !!q.url) && (
						<>
							<h3>Sources</h3>
							<ul className="flex flex-col">
								{queries.queries.map((query) => (
									<li key={query.id}>
										<a target="_blank" href={query.url}>
											{query.url}
										</a>
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			)}
		</div>
	);
}
