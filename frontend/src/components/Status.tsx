import { cn } from "@/lib/utils";
import { useResearchState } from "@/state/research.state";
import { useShallow } from "zustand/react/shallow";
import { motion } from 'motion/react'
import StatusIndicator from "./StatusIndicator";

const statuses = {
    1: "Connected",
    2: 'Generating Queries',
    3: 'Searching Web',
    4: 'Scraping Data',
    5: 'Generating Report',
    6: 'Complete'
}

export default function Status() {
    const { status, updateStatus } = useResearchState(useShallow(state => state))

    return <div className="flex flex-col gap-5 min-w-max">
        {Object.entries(statuses).map(([num, text]) => {
            return (
                <div
                    className="relative cursor-pointer"

                    //TODO: remove
                    onClick={() => updateStatus(Number(num), 'gpt-4o-mini')}
                >
                    <div className="flex gap-2 items-center">
                        <motion.span
                            animate={{
                                opacity: status === 0 && Number(num) === 1 ? 1 : status < Number(num) ? 0.1 : 1,
                                filter: status < Number(num) ? 'grayscale(1)' : 'grayscale(0)',
                                transition: {
                                    duration: 1,
                                    ease: 'easeOut'
                                }
                            }}
                        >
                            <StatusIndicator thisStatus={Number(num)} />
                            <motion.div
                                className={cn(["absolute top-[90%] left-1/2 -translate-x-1/2 h-0 w-0.5", status > Number(num) + 1 ? 'bg-green-700' : 'bg-gradient-to-b to-gray-500 from-green-700'])}
                                animate={{
                                    height: status <= Number(num) ? 0 : '120%',
                                    transition: {
                                        duration: 1,
                                        ease: 'easeOut'
                                    }
                                }}
                            />
                        </motion.span>
                        <span className={cn([status < Number(num) && 'opacity-[0.1]', status === 0 && Number(num) === 1 && 'opacity-100'])}>{status === 0 && Number(num) === 1 ? 'Connecting' : text}</span>
                    </div>
                </div>
            )
        })}
    </div >
}

