from agents import Agent, Runner
import os
from llm_agents.input_guardrail import input_guardrail_function
from pydantic import BaseModel, Field
from agents.extensions.models.litellm_model import LitellmModel


class GeneratedQuery(BaseModel):
    query: str
    id: int


class GeneratedQueriesOutput(BaseModel):
    queries: list[GeneratedQuery] = Field(description="A list of queries")
    explanation: str = Field(description="A short description of the queries or explanation of why they were selected and what topics they touch on.")


number_of_queries = int(os.getenv("NUM_OF_QUERIES"))

instructions = (
    f"Generate {number_of_queries} distinct, well-formed, insightful research queries based on the user’s original input. "
    "The queries should explore the topic deeply from multiple relevant angles. "
    "Provide a brief explanation of your reasoning in 1–2 sentences. "
    "The explanation should summarize the main topics, themes, or areas that the queries cover and why they are important for understanding the research topic. "
    "Do NOT explain each query individually."
    "Each query in the output list must be phrased as a clear, precise question or search term. "
    f"Output: A list of exactly {number_of_queries} queries. Each query object should contain two fields: 'query' (the query in the form of a question) and 'id' (its index). "
    "Quality & Style: Each query should be clear and unambiguous. Cover diverse subtopics or related aspects of the original query. Avoid trivial or overly broad queries. "
    "Use relevant technical terms or domain-specific language if applicable. Include different perspectives or angles, e.g., causes, effects, history, comparisons, applications, controversies, recent developments. "
    "Examples: If input is 'climate change effects', output queries might include: "
    "'What are the primary environmental impacts of climate change?', "
    "'How does climate change affect marine biodiversity?', "
    "'Economic consequences of climate change on agriculture', "
    "'Recent scientific studies on climate change mitigation strategies'. "
    "The explanation might be: 'These queries aim to explore environmental, ecological, economic, and scientific aspects of climate change, focusing on the key factors that influence its impacts and mitigation strategies.'"
)


queries_generator = Agent(
    name="Queries Generator",
    model=LitellmModel(
        model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY")
    ),
    instructions=instructions,
    output_type=GeneratedQueriesOutput,
    input_guardrails=[input_guardrail_function]
)


async def run_queires_generator(original_query: str, context=None):
    try:
        generated_queries_result = await Runner.run(
            queries_generator, input=original_query, context=context
        )
        output: GeneratedQueriesOutput = generated_queries_result.final_output
        return output
    except Exception as e:
        print(f"{queries_generator.model.model} error: {str(e)}")
        raise Exception("Error generating queries...")
