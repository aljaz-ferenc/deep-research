import { useShallow } from "zustand/react/shallow";
import ResearchProgressScreen from "@/components/ResearchProgressScreen.tsx";
import UserInputScreen from "@/components/UserInputScreen.tsx";
import { Statuses } from "@/core/Models.ts";
import { useResearchState } from "@/state/research.state.ts";

export default function HomeRoute() {
	const [status] = useResearchState(useShallow((state) => [state.status]));
	return (
		<main className="flex-grow flex justify-center">
			{status < Statuses.VERIFYING_INPUT ? (
				<UserInputScreen />
			) : (
				<ResearchProgressScreen />
			)}
		</main>
	);
}
