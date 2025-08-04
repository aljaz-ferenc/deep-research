from agents import Agent, WebSearchTool
from llm_agents.queries_generator import GeneratedQueriesOutput
from pydantic import BaseModel
from agents import Runner, trace


def get_web_searcher_input(explanation: str, queries: GeneratedQueriesOutput):
    return [
    {
        "role": "user",
        "content":
            "Here is an explanation of what the research is about:\n\n"
            f"{explanation}\n\n"
            "Here are the queries:\n" +
            "\n".join(f"{q['id']}. {q['query']}" for q in queries) +
            "\n\nFor each query, return a URL that answers it. Respond with a list of query_id and url."
    }
]

class SearchResult(BaseModel):
    query_id: int
    url: str

instructions = (
    "You will receive a list of research queries with an explanation about why they were selected to be answered for a research. "
    "Each query includes: id (a unique identifier) and query (the search query string) "
    "For each query use the WebSearch tool to find one high-quality URL that best answers or explains the query."
    "Return a dictionary with query_id (the original id) and url (the most relevant and informative url) "
    "Return the result as a list of dictionaries, for example: [{ 'query_id': 1, 'url': 'https://reliable.com/article1' },{ 'query_id': 2, 'url': 'https://trustedsource.org/info2' }]"
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