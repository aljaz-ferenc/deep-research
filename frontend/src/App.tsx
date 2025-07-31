import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { querySchema } from "./core/Models";
import useStartResearch from "./hooks/api/useStartResearch";
import { use } from "react";
import { WebSocketContext } from "./provider/WebSocketProvider";

const startResearchFormSchema = z.object({
	query: querySchema,
});

function App() {
	const { mutateAsync: startResearch, error, isError } = useStartResearch();
	const socket = use(WebSocketContext)

	const startResearchForm = useForm<z.infer<typeof startResearchFormSchema>>({
		resolver: zodResolver(startResearchFormSchema),
		defaultValues: {
			query: "",
		},
	});

	const submitForm = async (
		values: z.infer<typeof startResearchFormSchema>,
	) => {
		// await startResearch(values.query);
		if (!socket) return
		socket.emit('query', values.query)
	};

	if (isError) {
		console.log(`ERROR: ${error}`);
	}

	return (
		<>
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
					<Button type="submit" className="mt-5">
						Start Research
					</Button>
				</form>
			</Form>
		</>
	);
}

export default App;
