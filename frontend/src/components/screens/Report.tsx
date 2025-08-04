import { useRef } from "react";
import Markdown from "react-markdown";
import { useReactToPrint } from "react-to-print";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useResearchState } from "@/state/research.state";
import { Button } from "../ui/button";

type ReportProps = {
	className?: string;
};

export default function Report({ className }: ReportProps) {
	const { report } = useResearchState(useShallow((state) => state));
	const reportRef = useRef<HTMLDivElement>(null);
	const reactToPrint = useReactToPrint({
		contentRef: reportRef,
		pageStyle: `
        @page {
            size: A4;
            margin: 20mm;
        }
        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    `,
	});

	return (
		<div ref={reportRef} id="report" className={cn([className])}>
			<Button
				type="button"
				variant="link"
				onClick={reactToPrint}
				className="cursor-pointer mb-10 mx-0 px-0"
			>
				Print to PDF
			</Button>
			<Markdown
				components={{
					h2: ({ node, ...props }) => {
						const text = String(props.children);
						const id = text.toLowerCase().replace(/\s+/g, "-");
						return <h2 id={id} {...props} />;
					},
					h3: ({ node, ...props }) => {
						const text = String(props.children);
						const id = text.toLowerCase().replace(/\s+/g, "-");
						return <h3 id={id} {...props} />;
					},
				}}
			>
				{report}
			</Markdown>
		</div>
	);
}
