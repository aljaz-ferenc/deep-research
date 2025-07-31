from agents import Agent
import os

# number_of_queries = os.getenv("NUM_OF_QUERIES")
number_of_queries = 2

instructions = (
    f"Generate {number_of_queries} distinct, well-formed, insightful research queries based on the user’s original input. The queries should help explore the topic deeply and from multiple relevant angles. "
    "Input: A single user query (a phrase, sentence, or keywords describing a research topic or question). "
    f"Output: Exactly {number_of_queries} queries as a list of strings. "
    "Quality & Style: Each query should be clear and unambiguous. Queries should be phrased as questions or precise search terms. Cover diverse subtopics or related aspects of the original query. Avoid trivial or overly broad queries. Use relevant technical terms or domain-specific language if applicable. Include different perspectives or angles, e.g., causes, effects, history, comparisons, applications, controversies, recent developments. "
    "Examples: If input is 'climate change effects', output queries might include: 'What are the primary environmental impacts of climate change?', 'How does climate change affect marine biodiversity?', 'Economic consequences of climate change on agriculture', 'Recent scientific studies on climate change mitigation strategies' and so forth."
)

queries_generator = Agent(
    name="Queries Generator",
    model="gpt-4o-mini",
    instructions=instructions,
    output_type=list[str]
)