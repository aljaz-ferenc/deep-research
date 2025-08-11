import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useResearchState } from "@/state/research.state";
import StatusIndicator from "./StatusIndicator";

const statuses = {
	1: "Connected",
	2: "Generating Queries",
	3: "Searching Web",
	4: "Scraping Data",
	5: "Generating Report",
	6: "Complete",
} as const;

export default function Status() {
	const { status, model } = useResearchState(useShallow((state) => state));

	return (
		<>
			<div className="md:hidden flex flex-col font-bold">
				{status === 0 ? 'Connecting ...' : `${statuses[status as 1 | 2 | 3 | 4 | 5 | 6]}`}
				<span className="font-bold italic text-xs">
					{model.includes("/") ? model.split("/")[1] : model}
				</span>
			</div>
			<div className="flex-col gap-8 min-w-max hidden md:flex">
				{Object.entries(statuses).map(([num, text]) => {
					return (
						<div className="relative cursor-pointer" key={num}>
							<div className="flex gap-2 items-center">
								<motion.span
									animate={{
										opacity:
											status === 0 && Number(num) === 1
												? 1
												: status < Number(num)
													? 0.1
													: 1,
										filter:
											status < Number(num) ? "grayscale(1)" : "grayscale(0)",
										transition: {
											duration: 1,
											ease: "easeOut",
										},
									}}
								>
									<StatusIndicator thisStatus={Number(num)} />
									<motion.div
										className={cn([
											"absolute top-[90%] left-1/2 -translate-x-1/2 h-0 w-0.5",
											status > Number(num) + 1
												? "bg-green-700"
												: "bg-gradient-to-b to-gray-500 from-green-700",
										])}
										animate={{
											height: status <= Number(num) ? 0 : "180%",
											transition: {
												duration: 1,
												ease: "easeOut",
											},
										}}
									/>
								</motion.span>
								<div className="flex flex-col relative">
									<span
										className={cn([
											status < Number(num) && "opacity-[0.1]",
											status === 0 && Number(num) === 1 && "opacity-100",
										])}
									>
										{status === 0 && Number(num) === 1 ? "Connecting" : text}
									</span>
									{status === Number(num) && model && (
										<span className="absolute top-full italic -translate-y-1 left-0 text-xs font-semibold">
											{model.includes("/") ? model.split("/")[1] : model}
										</span>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
