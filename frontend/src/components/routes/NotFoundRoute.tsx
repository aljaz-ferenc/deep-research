import { FileSearch } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/AppButton.tsx";

export default function NotFoundRoute() {
	return (
		<body className="bg-background-dark font-display text-gray-100">
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<div className="w-full max-w-md text-center">
					<div className="mb-6 flex justify-center text-primary">
						<FileSearch size={80} />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
						404 - Page Not Found
					</h1>
					<p className="mt-4 text-base text-gray-600 dark:text-gray-300">
						Sorry, the page you are looking for could not be found. It might
						have been removed, had its name changed, or is temporarily
						unavailable.
					</p>
					<div className="mt-8 space-y-4">
						<Link className={buttonVariants({ intent: "primary" })} to="/">
							Go to Homepage
						</Link>
					</div>
				</div>
			</div>
		</body>
	);
}
