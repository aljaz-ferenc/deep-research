import { StepItem } from "@/components/routes/home/StepItem.tsx";
import { STEPS } from "@/data/steps.tsx";

export default function ResearchProgressScreen() {
	return (
		<main className="flex-1">
			<div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
				<div className="space-y-12">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
						Research Progress
					</h1>
					<div className="grid grid-cols-[auto_1fr] gap-x-6">
						{STEPS.map((step) => {
							return <StepItem step={step} key={step.status} />;
						})}
					</div>
				</div>
			</div>
		</main>
	);
}
