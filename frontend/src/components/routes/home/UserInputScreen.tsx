import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useShallow } from "zustand/react/shallow";
import { AppButton } from "@/components/ui/AppButton.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { querySchema } from "@/core/Models.ts";
import { useReportLimit } from "@/hooks/api/useReportLimit.ts";
import { WebSocketContext } from "@/provider/WebSocketProvider.tsx";
import { useResearchState } from "@/state/research.state.ts";

const startResearchFormSchema = z.object({
	query: querySchema,
});

export default function UserInputScreen() {
	const socket = use(WebSocketContext);
	const { resetStore } = useResearchState(useShallow((state) => state));
	const { data, error } = useReportLimit();
	console.log(data);
	console.log(error);

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
		resetStore();
	};
	return (
		<main className="container mx-auto px-4 sm:px-6 lg:px-8 text-center self-center">
			<div className="max-w-2xl mx-auto">
				<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
					Generate a report on any topic
				</h2>
				<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
					Our AI-powered research tool analyzes vast amounts of data to provide
					you with comprehensive reports. Simply enter your topic of interest
					and let our system do the rest.
				</p>
				<div className="mt-8 sm:mt-12">
					<Form {...startResearchForm}>
						<form
							onSubmit={startResearchForm.handleSubmit(submitForm)}
							className="flex w-full gap-2"
						>
							<FormField
								control={startResearchForm.control}
								name="query"
								render={({ field }) => (
									<FormItem className="relative w-full">
										<FormControl>
											<Input
												className="w-full h-full px-5 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-background-dark focus:ring-2 focus:!ring-primary/20 focus:border-primary transition-colors placeholder-gray-500 dark:placeholder-gray-400"
												id="topic-input"
												placeholder="e.g., 'The future of renewable energy'"
												type="text"
												{...field}
											/>
										</FormControl>
										<FormMessage className="justify-self-start" />
									</FormItem>
								)}
							/>
							{data && (
								<AppButton
									disabled={data.used >= data.limit}
									type="submit"
									intent={"primary"}
								>
									Start Research
								</AppButton>
							)}
						</form>
					</Form>
					{data && (
						<div>
							{data && data.remaining > 0 ? (
								<p className="text-muted-foreground mt-2">
									You have{" "}
									<strong className="text-white">{data.remaining}</strong>{" "}
									reports remaining for today.
								</p>
							) : (
								<p className="text-destructive/80 mt-2">
									You have reached the limit of
									<strong className="text-destructive"> {data.limit}</strong>{" "}
									report generations today.
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
