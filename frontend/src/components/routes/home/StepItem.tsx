import { ArrowRight, Check, CircleAlert, Flag, Link2 } from "lucide-react";
import Markdown from "react-markdown";
import { Link } from "react-router";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import FeedbackContainer from "@/components/routes/home/FeedbackContainer.tsx";
import GeneratedQueries from "@/components/routes/home/GeneratedQueries.tsx";
import { buttonVariants } from "@/components/ui/AppButton.tsx";
import StepSpinner from "@/components/ui/StepSpinner.tsx";
import { Statuses } from "@/core/Models.ts";
import { STEPS, type Step } from "@/data/steps.tsx";
import { cn } from "@/lib/utils.ts";
import { useResearchState } from "@/state/research.state.ts";

type StepItemProps = {
	step: Step;
};

export function StepItem({ step }: StepItemProps) {
	const [status, error, inputDecision, queries, reportId, resetStore] =
		useResearchState(
			useShallow((state) => [
				state.status,
				state.error,
				state.inputDecision,
				state.queries,
				state.reportId,
				state.resetStore,
			]),
		);

	return (
		<>
			<div className="flex flex-col items-center">
				{error && status === step.status ? (
					<div className="flex size-10 items-center justify-center rounded-full bg-destructive text-white ring-4 ring-destructive/10">
						<CircleAlert />
					</div>
				) : (
					<>
						{step.status === status && status !== 7 && <StepSpinner />}
						{step.status < status && (
							<div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white ring-4 ring-green-500/10">
								<Check />
							</div>
						)}
						{step.status > status && (
							<div className="flex size-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500">
								{step.icon}
							</div>
						)}
						{step.status === status && status === 7 && (
							<div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white ring-4 ring-green-500/10">
								<Flag />
							</div>
						)}
					</>
				)}
				<div
					className={cn([
						"w-px flex-1 bg-gray-300 dark:bg-gray-700",
						step.status === STEPS.length + 1 && "hidden",
					])}
				></div>
			</div>
			<div className="pb-12 pt-1">
				<p className="text-base font-semibold text-gray-500 dark:text-gray-400">
					{step.name}
				</p>
				{status === Statuses.COMPLETE && step.status === status ? (
					<div>
						<p className="text-sm text-gray-400 dark:text-gray-500">
							Your report is ready!
						</p>
					</div>
				) : (
					<p className="text-sm text-gray-400 dark:text-gray-500">
						{step.description}
					</p>
				)}
				{!error &&
					status === Statuses.COMPLETE &&
					step.status === status &&
					reportId && (
						<Link
							onClick={() => {
								setTimeout(() => {
									resetStore();
								}, 500);
							}}
							to={`/reports/${reportId}`}
							type="button"
							className={cn([buttonVariants({ intent: "primary" }), "mt-2"])}
						>
							<span>View Report</span>
							<span className="material-symbols-outlined text-base">
								<ArrowRight />
							</span>
						</Link>
					)}
				{error && status === step.status && (
					<FeedbackContainer isError>
						<div>
							{status === Statuses.VERIFYING_INPUT &&
							!inputDecision?.is_input_valid ? (
								<>
									<h3 className="text-sm font-semibold text-destructive">
										Input Rejected
									</h3>
									<Markdown
										remarkPlugins={[remarkGfm]}
										rehypePlugins={[rehypeSlug]}
										components={{
											p: ({ ...props }) => (
												<p
													className="mt-1 text-sm text-destructive/80"
													{...props}
												/>
											),
											strong: ({ ...props }) => (
												<strong {...props} className="text-destructive" />
											),
										}}
									>
										{inputDecision?.reasoning}
									</Markdown>
								</>
							) : (
								<>
									<h3 className="text-sm font-semibold text-destructive">
										Error
									</h3>
									<p className="mt-1 text-sm text-destructive/90">{error}</p>
								</>
							)}
						</div>
					</FeedbackContainer>
				)}
				{status > Statuses.GENERATING_QUERIES &&
					step.status === Statuses.GENERATING_QUERIES &&
					queries && (
						<FeedbackContainer>
							<GeneratedQueries queriesOutput={queries} />
						</FeedbackContainer>
					)}
				{status > Statuses.VERIFYING_INPUT &&
					step.status === Statuses.VERIFYING_INPUT &&
					inputDecision && (
						<FeedbackContainer isError={!inputDecision.is_input_valid}>
							<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
								Agent Feedback
							</h3>
							<Markdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeSlug]}
								components={{
									p: ({ ...props }) => (
										<p
											className="mt-1 text-sm text-gray-600 dark:text-gray-400"
											{...props}
										/>
									),
								}}
							>
								{inputDecision.reasoning}
							</Markdown>
						</FeedbackContainer>
					)}
				{status > Statuses.SEARCHING_WEB &&
					step.status === Statuses.SEARCHING_WEB &&
					queries &&
					queries.queries.some((q) => !!q.url) && (
						<FeedbackContainer>
							<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
								Sources
							</h3>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
								<ul className="space-y-2">
									{queries.queries.map((q) => (
										<>
											{q.url && (
												<li
													key={q.id}
													className="text-blue-500 hover:underline"
												>
													<Link
														target="_blank"
														to={q.url}
														className="flex items-center gap-2"
													>
														<Link2 size={15} className="min-w-[15px]" />
														{q.url}
													</Link>
												</li>
											)}
										</>
									))}
								</ul>
							</p>
						</FeedbackContainer>
					)}
			</div>
		</>
	);
}
