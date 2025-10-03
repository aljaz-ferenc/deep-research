import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/AppButton.tsx";

export default function ServerError() {
	return (
		<main className="flex-grow justify-center py-8">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900/50">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
						<AlertCircle size={40} className="text-red-400" />
					</div>
					<h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
						Oops! Something went wrong.
					</h2>
					<p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-md">
						We encountered and unexpected issue while processing your request.
						Please try again
					</p>
					<div className="mt-8 flex items-center justify-center gap-4">
						<Link
							to="/reports"
							className={buttonVariants({ intent: "primary" })}
						>
							<ArrowLeft className="mr-2" size={15} />
							Back to Reports
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
