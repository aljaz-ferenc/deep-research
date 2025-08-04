import { useShallow } from "zustand/react/shallow";
import { Statuses } from "@/core/Models";
import { useResearchState } from "@/state/research.state";

export default function Process() {
	const { status, queries, error } = useResearchState(
		useShallow((state) => state),
	);
	console.log(queries);

	return (
		<div className="h-full w-full flex">
			{status === Statuses.WAITING_CONNECTION && <div>Connecting...</div>}
			{status === Statuses.GENERATING_QUERIES && <div>Thinking...</div>}
			{queries && (
				<div>
					<h3 className="mt-0">Generated queries</h3>
					<ol>
						{queries.queries.map((query, index) => (
							<li key={`query-${index + 1}`}>
								<span>{query.query}</span>
								{/* {query.url && (
									<span className="block">
										<span className="italic">Source: </span>
										<a
											target="_blank"
											href={query.url}
											className="italic underline cursor-pointer"
										>
											{query.url}
										</a>
									</span>
								)} */}
							</li>
						))}
					</ol>
					<h3>Reasoning for generating queries above</h3>
					<p>{queries.explanation}</p>
					{error && (
						<div>
							<h3 className="text-red-500">Something went wrong:</h3>
							<p>{error}</p>
						</div>
					)}
					<h3>Sources</h3>
					<ul className="flex flex-col">
						{queries.queries.map(query => (
							<li>
								<a>{query.url}</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
