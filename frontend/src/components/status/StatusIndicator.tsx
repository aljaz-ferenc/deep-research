import { Statuses } from "@/core/Models"
import { cn } from "@/lib/utils"
import { useResearchState } from "@/state/research.state"
import { CircleCheck, CircleDashed } from "lucide-react"
import { useShallow } from "zustand/react/shallow"

export default function StatusIndicator({ thisStatus }: { thisStatus: number }) {
    const { status } = useResearchState(useShallow(state => state))

    const isComplete = status === Statuses.COMPLETE
    const isConnecting = status === Statuses.WAITING_CONNECTION
    const isConnected = status === Statuses.READY

    if (isConnecting) {
        if (thisStatus - 1 === status) {
            return <span className={cn(["block animation-duration-[3s]", status === thisStatus - 1 && 'animate-spin '])}>
                <CircleDashed size={'3ex'} />
            </span>
        }
        if (thisStatus !== 1) {
            return <span className={cn(["block animation-duration-[3s]", status === thisStatus - 1 && 'animate-spin '])}>
                <CircleDashed size={'3ex'} />
            </span>
        }
    }

    if (isConnected) {
        if (thisStatus === status) {
            return <span>
                <CircleCheck size={'3ex'}
                    color='green'
                />
            </span>
        } else {
            return <span className={cn(["block"])}>
                <CircleDashed size={'3ex'} />
            </span>
        }
    }

    if (isComplete) {
        return <span>
            <CircleCheck size={'3ex'}
                color='green'
            />
        </span>
    }

    if (status === thisStatus) {
        return <span className={cn(["block animation-duration-[3s] animate-spin"])}>
            <CircleDashed size={'3ex'} />
        </span>
    }

    if (status > thisStatus) {
        return <span>
            <CircleCheck size={'3ex'}
                color='green'
            />
        </span>
    } else if (status < thisStatus) {
        return <span className={cn(["block"])}>
            <CircleDashed size={'3ex'} />
        </span>
    }
}