import { CircleQuestionMark } from "lucide-react";
import type { GeneratedQueriesOutput } from "@/core/Models.ts";

export default function GeneratedQueries({
	queriesOutput,
}: {
	queriesOutput: GeneratedQueriesOutput;
}) {
	return (
		<>
			<div>
				<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
					Agent Feedback
				</h3>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					{queriesOutput.explanation}
				</p>
			</div>
			<hr className="my-3" />
			<div>
				<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
					Generated Queries
				</h3>
				<ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
					{queriesOutput.queries.map((query) => (
						<li className="flex gap-3 items-center" key={query.id}>
							<CircleQuestionMark size={15} className="min-w-[15px]" />
							<span className="">{query.query}</span>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
