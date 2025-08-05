import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Process from "./components/screens/Process";
import Report from "./components/screens/Report";
import UserInput from "./components/screens/UserInput";
import Status from "./components/status/Status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Statuses } from "./core/Models";
import { useResearchState } from "./state/research.state";

export enum TabsEnum {
	USER_INPUT = "userInput",
	THINKING_PROCESS = "thinkingProcess",
	REPORT = "report",
}

function App() {
	const { status, report, queries } = useResearchState(
		useShallow((state) => state),
	);
	const [currentTab, setCurrentTab] = useState(TabsEnum.USER_INPUT as string);

	return (
		<main className="max-w-6xl h-screen mx-auto prose prose-a:text-blue-500 py-16 flex flex-col">
			<h1 className="mb-14">Deep Research</h1>
			<div className="flex gap-10 flex-1 min-h-0">
				<Status />
				{status > Statuses.WAITING_CONNECTION && (
					<Tabs
						onValueChange={setCurrentTab}
						value={currentTab}
						defaultValue={TabsEnum.THINKING_PROCESS}
						className="w-full flex flex-col flex-1 min-h-0"
					>
						<TabsList>
							<TabsTrigger
								className="cursor-pointer"
								value={TabsEnum.USER_INPUT}
							>
								Input
							</TabsTrigger>
							<TabsTrigger
								disabled={status < 2 && !queries?.explanation}
								className="cursor-pointer"
								value={TabsEnum.THINKING_PROCESS}
							>
								Process
							</TabsTrigger>
							<TabsTrigger
								disabled={status < 6 && !report}
								className="cursor-pointer"
								value={TabsEnum.REPORT}
							>
								Report
							</TabsTrigger>
						</TabsList>

						<TabsContent value={TabsEnum.USER_INPUT} className="flex-1 min-h-0">
							<div className="w-full h-full border py-5 px-16 rounded">
								<UserInput setCurrentTab={setCurrentTab} />
							</div>
						</TabsContent>

						<TabsContent
							value={TabsEnum.THINKING_PROCESS}
							className="flex-1 min-h-0"
						>
							<div className="w-full h-full border py-5 px-16 rounded overflow-y-auto">
								<Process />
							</div>
						</TabsContent>

						<TabsContent value={TabsEnum.REPORT} className="flex-1 min-h-0">
							<div className="w-full h-full border py-5 px-16 rounded overflow-y-auto">
								<Report />
							</div>
						</TabsContent>
					</Tabs>
				)}
			</div>
		</main>
	);
}

export default App;
