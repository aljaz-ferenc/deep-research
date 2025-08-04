from agents import Agent, WebSearchTool
from llm_agents.queries_generator import GeneratedQueriesOutput
from pydantic import BaseModel
from agents import Runner, trace
import os

def get_web_searcher_input(explanation: str, queries: GeneratedQueriesOutput):
    return [
        {
            "role": "user",
            "content":
                "Here is an explanation of what the research is about:\n\n"
                f"{explanation}\n\n"
                "Here are the queries:\n" +
                "\n".join(f"{q.id}. {q.query}" for q in queries.queries) +
                "\n\nFor each query, return a URL that answers it. Respond with a list of query_id and url."
        }
    ]


class SearchResult(BaseModel):
    query_id: int
    url: str

number_of_queries = int(os.getenv("NUM_OF_QUERIES"))

instructions = (
    f"You will receive a list of {number_of_queries} research queries with an explanation. "
    f"For EACH query in the list, you MUST use the WebSearch tool to find EXACTLY ONE high-quality URL. This means {number_of_queries} URLs in total, one for each query."
    "Return ALL results as a list of dictionaries, with no omissions. "
    "If a query cannot be answered, provide a placeholder URL 'N/A' but still include it in the list. "
    "Format example: [{ 'query_id': 1, 'url': 'https://example.com' }, { 'query_id': 2, 'url': 'https://example.org' }]"
    "Prefer pages that are likely to load quickly and allow scraping. Avoid pages that frequently block bots, are password protected, have javascript disabled or take a long time to load."
)


web_searcher = Agent(
    name="Web Searcher",
    model="gpt-4o-mini",
    instructions=instructions,
    output_type=list[SearchResult],
    tools=[WebSearchTool()]
)

async def run_web_search(explanation: str, queries: GeneratedQueriesOutput):
    input = get_web_searcher_input(explanation, queries)
    web_search_result = await Runner.run(web_searcher, input=input)
    urls = [q.model_dump() for q in web_search_result.final_output]

    return urls