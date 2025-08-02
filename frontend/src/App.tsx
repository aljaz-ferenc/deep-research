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
	const { queries, status, report, model } = useResearchState(useShallow((state) => state));

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
		<main className="max-w-4xl mx-auto prose">
			<h1>Deep Research</h1>
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
					<Button type="submit" className="cursor-pointer">
						Start Research
					</Button>
				</form>
			</Form>
			<p>
				STATUS: {Statuses[status]} ({status})
			</p>
			{model && <p>MODEL: {model}</p>}
			{status > Statuses.GENERATING_QUERIES && queries && (
				<div className="mt-5">
					<h3>
						Generated queries
					</h3>
					<ol>
						{queries.queries.map((query, index) => (
							<li key={`query-${index + 1}`}>
								<span>
									{query.query}
								</span>
								{query.url && (
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
								)}
							</li>
						))}
					</ol>
					{/* <h3 className="flex flex-col">
						Why those queries were selected
					</h3>
					<p>
						{queries.explanation}
					</p> */}
				</div>
			)}
			<hr />
			{report && <Report className="mt-10 max-w-[800px] mx-auto" report={report} />}
			<hr />
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
			<Markdown>{report}
			</Markdown>
		</div>
	)
}
