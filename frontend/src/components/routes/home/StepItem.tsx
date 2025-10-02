import {
	ArrowRight,
	Check,
	CircleAlert,
	CircleQuestionMark,
	Flag,
	Link2,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import { buttonVariants } from "@/components/ui/AppButton.tsx";
import { type GeneratedQueriesOutput, Statuses } from "@/core/Models.ts";
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
							className={buttonVariants({ intent: "primary" })}
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
							<h3 className="text-sm font-semibold text-destructive">Error</h3>
							<p className="mt-1 text-sm text-destructive/90">{error}</p>
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

function FeedbackContainer({
	children,
	isError = false,
}: PropsWithChildren<{ isError?: boolean }>) {
	return (
		<div
			className={cn([
				"mt-4 rounded-lg bg-background-dark/5 dark:bg-background-light/5 p-4",
				isError && "bg-destructive/10",
			])}
		>
			{children}
		</div>
	);
}

function GeneratedQueries({
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

export function StepSpinner() {
	return (
		<div className="flex size-10 items-center justify-center rounded-full bg-primary ring-4 ring-primary/20 text-white">
			{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg
				className="animate-spin h-6 w-6 text-white"
				fill="none"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title aria-hidden></title>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					className="opacity-75"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					fill="currentColor"
				></path>
			</svg>
		</div>
	);
}

export function PageSpinner() {
	return (
		<div className="absolute  inset-0 z-10 flex flex-col items-center justify-center  dark:bg-background-dark/80 backdrop-blur-sm">
			{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg
				className="h-16 w-16 animate-spin text-primary"
				fill="none"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					className="opacity-75"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					fill="currentColor"
				></path>
			</svg>
			<p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
				Generating Report...
			</p>
		</div>
	);
}
