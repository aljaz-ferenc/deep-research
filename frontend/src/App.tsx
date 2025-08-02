import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { querySchema, Statuses } from "./core/Models";
import { WebSocketContext } from "./provider/WebSocketProvider";
import { useResearchState } from "./state/research.state";
import Markdown from 'react-markdown'
import { cn } from "./lib/utils";

const startResearchFormSchema = z.object({
	query: querySchema,
});

function App() {
	const socket = use(WebSocketContext);
	const { queries, status, report } = useResearchState(useShallow((state) => state));

	const startResearchForm = useForm<z.infer<typeof startResearchFormSchema>>({
		resolver: zodResolver(startResearchFormSchema),
		defaultValues: {
			query: "",
		},
	});

	const submitForm = async (
		values: z.infer<typeof startResearchFormSchema>,
	) => {
		if (!socket) return;
		socket.emit("query", values.query);
	};

	return (
		<main className="max-w-2xl mx-auto">
			<h1 className="font-bold text-2xl mb-5">Deep Research</h1>
			<Form {...startResearchForm}>
				<form onSubmit={startResearchForm.handleSubmit(submitForm)}>
					<FormField
						control={startResearchForm.control}
						name="query"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									What would you like me to do a research on?
								</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g. What is the effect of flouride on humans?"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="mt-5 cursor-pointer">
						Start Research
					</Button>
				</form>
			</Form>
			<p>
				STATUS: {Statuses[status]} ({status})
			</p>
			{status > Statuses.GENERATING_QUERIES && queries && (
				<div className="mt-5">
					<p>
						<strong>Questions</strong>
					</p>
					<ul className="flex flex-col gap-1">
						{queries.queries.map((query, index) => (
							<li key={`query-${index + 1}`} className="flex flex-col gap-2">
								<span>
									{query.id}. {query.query}
								</span>
								{query.url && (
									<a
										target="_blank"
										href={query.url}
										className="text-blue underline cursor-pointer"
									>
										{query.url}
									</a>
								)}
							</li>
						))}
					</ul>
					<p className="mb-5 flex flex-col mt-5">
						<strong>Explanation</strong>
						{queries.explanation}
					</p>
				</div>
			)}
			{report && <Report className="mt-10" report={report} />}
		</main>
	);
}

export default App;

type ReportProps = {
	report: string,
	className?: string
}

function Report({ report, className }: ReportProps) {
	return (
		<div className={cn(["prose", className])}>
			<Markdown >{report}
			</Markdown>
		</div>
	)
}
