from agents import Agent, Runner
from agents.extensions.models.litellm_model import LitellmModel
import os

WORD_COUNT = int(os.getenv("REPORT_WORD_COUNT"))

instructions = (
    "You are a research report writer. You will receive an original query from the user followed by multiple summaries "
    "of web search results. Your task is to create a comprehensive report that addresses the original query "
    "by combining the information from the search results into a coherent whole. "
    "The report should be well-structured, informative, and directly answer the original query. "
    "Focus on providing actionable insights and practical information. "
    f"Aim for up to {WORD_COUNT} words with clear sections and a conclusion. "
    "Important: Use markdown formatting. Have a table of contents in the beginning of the report that links to each section."
    "Try and include in-text citations to the sources used to create the report with a source list at the end of the report."
    "When writing sources under References, format them as a numbered list starting at 1. Always start numbering from 1. Do not add words like 'Source' or bold formatting. These will be rendered with a Markdown parser "
    "Format all headings (e.g. `#`, `##`, `###`) without including explicit ID anchors like `{#heading-id}`. "
    "Use plain Markdown headings, for example: `## Introduction` or `### Key Discoveries`. "
    "Generate a Table of Contents with links that match the headings' slug format, for example: `[Introduction](#introduction)`. "
    "Ensure all links and references in the TOC use consistent lowercase, hyphen-separated slugs matching the headings. "
    "Always start the document with a main heading (H1) using markdown syntax # . This heading should summarize the overall topic or title of the content. Make sure it appears as the very first line before any other content."
)

report_builder = Agent(
    name="Report Builder",
    instructions=instructions,
    model=LitellmModel(
        model="gemini/gemini-2.5-flash", api_key=os.getenv("GEMINI_API_KEY")
    ),
)


async def run_builder(original_query: str, summaries: str):
    try:
        report_builder_input = (
            f"Original query form the user: {original_query}\n"
            f"Summaries: {summaries}"
        )

        report_result = await Runner.run(report_builder, input=report_builder_input)
        return report_result.final_output
    except Exception as e:
        print(f"{report_builder.model.model} error: {str(e)}")
        raise Exception("Error building report...")
