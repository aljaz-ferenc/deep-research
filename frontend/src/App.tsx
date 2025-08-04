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
	const { status } = useResearchState(useShallow((state) => state));
	const [currentTab, setCurrentTab] = useState(TabsEnum.USER_INPUT as string);

	return (
		<main className="max-w-6xl mx-auto prose prose-a:text-blue-500 py-16 max-h-screen flex flex-col">
			<h1 className="mb-14">Deep Research</h1>
			<div className="flex gap-10 h-[80vh]">
				<Status />
				{status > Statuses.WAITING_CONNECTION && (
					<Tabs
						onValueChange={setCurrentTab}
						value={currentTab}
						defaultValue={TabsEnum.THINKING_PROCESS}
						className="w-full h-full "
					>
						<TabsList>
							<TabsTrigger
								className="cursor-pointer"
								value={TabsEnum.USER_INPUT}
							>
								Input
							</TabsTrigger>
							<TabsTrigger
								className="cursor-pointer"
								disabled={status < 2}
								value={TabsEnum.THINKING_PROCESS}
							>
								Process
							</TabsTrigger>
							<TabsTrigger
								className="cursor-pointer"
								disabled={status < 6}
								value={TabsEnum.REPORT}
							>
								Report
							</TabsTrigger>
						</TabsList>
						<TabsContent value={TabsEnum.USER_INPUT}>
							<div className="w-full h-full border p-5 rounded">
								<UserInput setCurrentTab={setCurrentTab} />
							</div>
						</TabsContent>
						<TabsContent value={TabsEnum.THINKING_PROCESS}>
							<div className="w-full h-full border p-5 rounded">
								<Process />
							</div>
						</TabsContent>
						<TabsContent value={TabsEnum.REPORT}>
							<Report className="border p-5 h-full overflow-y-auto" />
						</TabsContent>
					</Tabs>
				)}
			</div>
		</main>
	);
}

export default App;
