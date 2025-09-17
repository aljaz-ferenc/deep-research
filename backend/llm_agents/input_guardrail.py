from multiprocessing import context
from utils.utils import update_status
from models import CustomEvents, Statuses
from pydantic import BaseModel
from agents import (
    Agent,
    GuardrailFunctionOutput,
    RunContextWrapper,
    Runner,
    TResponseInputItem,
    input_guardrail
)
from agents.extensions.models.litellm_model import LitellmModel
import os


instructions = (
    "You are a guardrail system that decides if a user's query is worth doing in-depth research on. "
    "The query must be a broad topic, concept, or complex question that would require gathering and synthesizing information from multiple sources, "
    "typically in areas like science, history, technology, philosophy, or academia. "
    "Queries about practical advice, planning, travel, recipes, personal opinions, or simple instructions should be rejected. "
    "Examples of valid queries: 'origins of the universe', 'impact of climate change on agriculture', 'latest advancements in AI research'. "
    "\n\n"
    "Reject queries that are simple factual questions, casual conversation, personal advice, or things that can be answered with a short single response without research. "
    "Examples of invalid queries: 'how are you?', 'what is 2 + 2', 'capital of France', 'current time in New York', 'plan a 3-day trip to Italy', 'how to cook pasta'. "
    "\n\n"
    "For every decision:\n"
    "1. Set `is_input_valid` to True if the query is research-worthy, otherwise False.\n"
    "2. Provide a short markdown-formatted reasoning in `reasoning` explaining to the user why it is or isn’t valid. "
    "Always include the user's query somewhere in the reasoning and format it **bold** so the user knows exactly which query you are talking about.\n"
    "3. If invalid, give 3 example queries the user could try that would pass the check."
)



class GuardrailOutput(BaseModel):
    is_input_valid: bool
    reasoning: str

guardrail_agent = Agent(
    name="Input Guardrail",
    instructions=instructions,
    model=LitellmModel(
        model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY")
    ),
    output_type=GuardrailOutput
)

@input_guardrail
async def input_guardrail_function(ctx: RunContextWrapper[None], agent: Agent, input: str | list[TResponseInputItem]) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)
    
    sid = ctx.context.get("sid")
    sio = ctx.context.get("sio")

    if sio and sid:
        if result.final_output.is_input_valid:
            await update_status(Statuses.GENERATING_QUERIES, sid, guardrail_agent.model.model, sio)
        
        await sio.emit(CustomEvents.GUARDRAIL_DECISION.value, {
            "is_input_valid": result.final_output.is_input_valid,
            "reasoning": result.final_output.reasoning
        }, 
        namespace='/ws',
        to=sid
        )

    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=not result.final_output.is_input_valid
    )