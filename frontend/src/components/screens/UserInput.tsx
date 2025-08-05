import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, use } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useShallow } from "zustand/react/shallow";
import { TabsEnum } from "@/App";
import { querySchema } from "@/core/Models";
import { WebSocketContext } from "@/provider/WebSocketProvider";
import { useResearchState } from "@/state/research.state";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const startResearchFormSchema = z.object({
	query: querySchema,
});

type UserInputProps = {
	setCurrentTab: Dispatch<SetStateAction<string>>;
};

export default function UserInput({ setCurrentTab }: UserInputProps) {
	const socket = use(WebSocketContext);
	const { status, resetStore, error } = useResearchState(
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
		resetStore();
		setCurrentTab(TabsEnum.THINKING_PROCESS);
	};

	return (
		<div>
			<Form {...startResearchForm}>
				<form onSubmit={startResearchForm.handleSubmit(submitForm)}>
					<FormField
						control={startResearchForm.control}
						name="query"
						render={({ field }) => (
							<FormItem className="relative">
								<FormLabel className="mb-2">
									What would you like me to do a research on?
								</FormLabel>
								<FormControl>
									<Input
										disabled={status > 1 && !error && status !== 6}
										placeholder="e.g. What is the effect of flouride on humans?"
										{...field}
									/>
								</FormControl>
								<FormMessage className="absolute top-3/4 left-0" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={status > 1 && !error && status !== 6}
						className="cursor-pointer self-start mt-10"
					>
						Start Research
					</Button>
				</form>
			</Form>
		</div>
	);
}
