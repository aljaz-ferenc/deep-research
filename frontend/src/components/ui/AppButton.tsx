import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
	"inline-flex min-w-max items-center justify-center gap-2 px-4 rounded border cursor-pointer text-primary dark:text-primary font-medium  transition-colors",
	{
		variants: {
			intent: {
				primary: [
					"border-primary/50",
					"bg-primary/10 dark:bg-primary/20",
					"hover:bg-primary/20 dark:hover:bg-primary/30",
				],
				secondary: [
					"bg-white",
					"text-gray-800",
					"border-gray-400",
					"hover:bg-white/80",
				],
				outline: ["bg-transparent border-none hover:underline text-sm"],
			},
			size: {
				small: ["text-sm", "py-1", "px-2"],
				medium: ["text-base", "py-2", "px-4"],
			},
			disabled: {
				false: null,
				true: ["opacity-50", "cursor-not-allowed"],
			},
		},
		defaultVariants: {
			disabled: false,
			intent: "primary",
			size: "medium",
		},
	},
);

export interface ButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
		VariantProps<typeof buttonVariants> {}

export const AppButton: React.FC<ButtonProps> = ({
	className,
	intent,
	size,
	disabled,
	...props
}) => (
	<button
		className={buttonVariants({ intent, size, disabled, className })}
		disabled={disabled || undefined}
		{...props}
	/>
);
