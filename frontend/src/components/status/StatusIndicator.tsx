import { CircleCheck, CircleDashed, CircleX } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Statuses } from "@/core/Models";
import { cn } from "@/lib/utils";
import { useResearchState } from "@/state/research.state";

export default function StatusIndicator({
	thisStatus,
}: {
	thisStatus: number;
}) {
	const { status, error } = useResearchState(useShallow((state) => state));

	const isComplete = status === Statuses.COMPLETE;
	const isConnecting = status === Statuses.WAITING_CONNECTION;
	const isConnected = status === Statuses.READY;

	if (isConnecting) {
		if (thisStatus - 1 === status) {
			return <Circle animated={status === thisStatus - 1} />;
		}
		if (thisStatus !== 1) {
			return <Circle animated={status === thisStatus - 1} />;
		}
	}

	if (isConnected) {
		if (thisStatus === status) {
			return <Checkmark />;
		} else {
			return <Circle />;
		}
	}

	if (isComplete) {
		return <Checkmark />;
	}

	if (status === thisStatus) {
		if (error) {
			return <ErrorCircle />;
		}
		return <Circle animated />;
	}

	if (status > thisStatus) {
		return <Checkmark />;
	} else if (status < thisStatus) {
		return <Circle />;
	}
}

function Circle({ animated = false }: { animated?: boolean }) {
	return (
		<div
			className={cn([
				"block",
				animated && "animation-duration-[3s] animate-spin bg-white rounded-full",
			])}
		>
			<CircleDashed size={"3ex"} />
		</div>
	);
}

function Checkmark() {
	return (
		<div className="bg-white">
			<CircleCheck size={"3ex"} color="green" />
		</div>
	);
}

function ErrorCircle() {
	return (
		<div className="bg-white">
			<CircleX size={"3ex"} color="red" />
		</div>
	);
}
