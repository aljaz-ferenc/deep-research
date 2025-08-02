import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import Report from "./components/Report";
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
import Status from "./components/Status";

const startResearchFormSchema = z.object({
	query: querySchema,
});

function App() {
	const socket = use(WebSocketContext);
	const { queries, status, report, model, updateStatus } = useResearchState(
		useShallow((state) => state),
	);

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
		<main className="max-w-4xl mx-auto prose prose-a:text-blue-500 py-16">
			<h1 className="mb-14">Deep Research</h1>
			{/* <button onClick={() => updateStatus(Statuses.WAITING_CONNECTION, '')}>Set status to 0</button> */}
			<div className="flex gap-10">
				<Status />
				<div>
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
							<Button type="submit" className="cursor-pointer mt-3">
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
							<h3>Generated queries</h3>
							<ol>
								{queries.queries.map((query, index) => (
									<li key={`query-${index + 1}`}>
										<span>{query.query}</span>
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
						</div>
					)}
					<hr />
					{report && (
						<Report className="max-w-full text-justify" report={report} />
					)}
					<hr />
				</div>
			</div>
		</main>
	);
}

export default App;
