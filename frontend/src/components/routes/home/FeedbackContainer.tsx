import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils.ts";

export default function FeedbackContainer({
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
