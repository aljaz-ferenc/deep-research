import {
	FileQuestionMark,
	Files,
	Flag,
	ListCheck,
	Search,
	SquareChartGantt,
} from "lucide-react";
import type { ReactNode } from "react";

export type Step = {
	status: number;
	name: string;
	description: string;
	icon: ReactNode;
};

export const STEPS: Step[] = [
	{
		status: 2,
		name: "Verify User Input",
		description:
			"The AI checks your input for clarity and feasibility, ensuring we can conduct a successful research.",
		icon: <ListCheck />,
	},
	{
		status: 3,
		name: "Generate Queries",
		description:
			"The AI develops a set of targeted questions to guide the research for relevant information.",
		icon: <FileQuestionMark />,
	},
	{
		status: 4,
		name: "Search the Web",
		description:
			"Using the generated queries, the AI scans the internet for articles, studies, and data sources.",
		icon: <Search />,
	},
	{
		status: 5,
		name: "Scrape Data",
		description:
			"The AI extracts and cleans the relevant text and data from the identified web pages.",
		icon: <Files />,
	},
	{
		status: 6,
		name: "Generate Report",
		description:
			"The AI synthesizes the gathered information into a structured, comprehensive, and easy-to-read report.",
		icon: <SquareChartGantt />,
	},
	{
		status: 7,
		name: "Finished Report",
		description: "Your report will be available once all steps are complete.",
		icon: <Flag />,
	},
];
