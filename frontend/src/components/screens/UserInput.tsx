import { querySchema } from "@/core/Models";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { use, type Dispatch, type SetStateAction } from "react";
import { WebSocketContext } from "@/provider/WebSocketProvider";
import { useResearchState } from "@/state/research.state";
import { useShallow } from "zustand/react/shallow";
import { TabsEnum } from "@/App";

const startResearchFormSchema = z.object({
    query: querySchema,
});

type UserInputProps = {
    setCurrentTab: Dispatch<SetStateAction<string>>
}

export default function UserInput({ setCurrentTab }: UserInputProps) {
    const socket = use(WebSocketContext);
    const { status, resetStore } = useResearchState(
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
        resetStore()
        setCurrentTab(TabsEnum.THINKING_PROCESS)

    };

    return (
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
                                        disabled={status > 1}
                                        placeholder="e.g. What is the effect of flouride on humans?"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={status > 1} className="cursor-pointer mt-3">
                        Start Research
                    </Button>
                </form>
            </Form>
        </div>

    )
}