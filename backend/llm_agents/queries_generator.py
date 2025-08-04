from agents import Agent, Runner
import os
from pydantic import BaseModel
from agents.extensions.models.litellm_model import LitellmModel

class GeneratedQuery(BaseModel):
    query: str
    id: int

class GeneratedQueriesOutput(BaseModel):
    queries: list[GeneratedQuery]
    explanation: str

number_of_queries = int(os.getenv("NUM_OF_QUERIES"))

instructions = (
    f"Generate {number_of_queries} distinct, well-formed, insightful research queries based on the user’s original input. The queries should help explore the topic deeply and from multiple relevant angles. Please provide the explanation of your thought process and why you chose those specific queries. Explanation does not have to go into details for every single query, it should be an overview about what topics the research should include and why they are important for the research. Make the explanation sound formal and do not talk about yourself in first person. In your answer refer to queries as 'questions' so it sounds more natural to the user. "
    "Input: A single user query (a phrase, sentence, or keywords describing a research topic or question). "
    f"Output: Exactly {number_of_queries} queries as an object that contains two fields: query and id, and explanation of your thinking process. Id can be the index of the query. "
    "Quality & Style: Each query should be clear and unambiguous. Queries should be phrased as questions or precise search terms. Cover diverse subtopics or related aspects of the original query. Avoid trivial or overly broad queries. Use relevant technical terms or domain-specific language if applicable. Include different perspectives or angles, e.g., causes, effects, history, comparisons, applications, controversies, recent developments. "
    "Examples: If input is 'climate change effects', output queries might include: 'What are the primary environmental impacts of climate change?', 'How does climate change affect marine biodiversity?', 'Economic consequences of climate change on agriculture', 'Recent scientific studies on climate change mitigation strategies' and so forth. "
)

queries_generator = Agent(
    name="Queries Generator",
    model=LitellmModel(
        model="gemini/gemini-2.5-flash",
        api_key=os.getenv("GEMINI_API_KEY")
    ),
    instructions=instructions,
    output_type=GeneratedQueriesOutput
)

async def run_queires_generator(original_query: str):
    generated_queries_result = await Runner.run(queries_generator, input=original_query)
    output: GeneratedQueriesOutput = generated_queries_result.final_output
    return output