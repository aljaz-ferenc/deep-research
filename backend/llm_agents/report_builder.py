from agents import Agent
from agents.extensions.models.litellm_model import LitellmModel
import os

WORD_COUNT=500

instructions = (
    "You are a research report writer. You will receive an original query from the user followed by multiple summaries "
    "of web search results. Your task is to create a comprehensive report that addresses the original query "
    "by combining the information from the search results into a coherent whole. "
    "The report should be well-structured, informative, and directly answer the original query. "
    "Focus on providing actionable insights and practical information. "
    f"Aim for up to {WORD_COUNT} words with clear sections and a conclusion. "
    "Important: Use markdown formatting. Have a table of contents in the beginning of the report that links to each section."
    "Try and include in-text citations to the sources used to create the report with a source list at the end of the report."
)

report_builder = Agent(
    name="Report Builder",
    instructions=instructions,
    model=LitellmModel(
        model="gemini/gemini-2.5-flash",
        api_key=os.getenv("GEMINI_API_KEY")
    )
)