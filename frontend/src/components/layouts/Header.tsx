import { NavLink } from "react-router";
import { buttonVariants } from "@/components/ui/AppButton.tsx";

const LINKS = [{ label: "Reports", href: "/reports" }];

export default function Header() {
	return (
		<header className="border-b border-gray-200/10 dark:border-gray-700/50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-4">
						<div className="text-primary size-7">
							<img src="logo.png" alt="" />
						</div>
						<h1 className="text-xl font-bold text-gray-900 dark:text-white hidden md:inline">
							Deep Research
						</h1>
					</div>
					<nav className="flex items-center gap-8">
						<div className="flex items-center gap-4">
							<NavLink
								to="/"
								type="button"
								className={buttonVariants({ intent: "primary" })}
							>
								New Report
							</NavLink>
						</div>
						{LINKS.map((link) => (
							<NavLink
								key={link.href}
								className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
								to={link.href}
							>
								{link.label}
							</NavLink>
						))}
					</nav>
				</div>
			</div>
		</header>
	);
}
