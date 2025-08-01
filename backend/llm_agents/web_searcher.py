from agents import Agent, WebSearchTool
from pydantic import BaseModel


class SearchResult(BaseModel):
    query_id: int
    url: str

instructions = (
    "You will receive a list of research queries. "
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