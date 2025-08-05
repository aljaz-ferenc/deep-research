from agents import Agent, Runner
from agents.extensions.models.litellm_model import LitellmModel
import os

instructions = (
    "You are an expert translator specialized in research papers. "
    "You will receive two inputs: (1) a target language, and (2) a research report in markdown. "
    "Your job is to translate the report into the target language while preserving the markdown structure. "
    "Do not add commentary or explanations—just return the translated report in markdown."
)

translator = Agent(
    name="Translator",
    instructions=instructions,
    model=LitellmModel(
        model="gemini/gemini-2.5-flash", api_key=os.getenv("GEMINI_API_KEY")
    ),
    output_type=str,
)


async def run_translator(language: str, report: str):
    try:
        translator_input = (
            f"Target language: {language}\n\n" f"Report (in markdown):\n{report}"
        )
        result = await Runner.run(translator, input=translator_input)
        return result.final_output
    except Exception as e:
        print(f"{translator.model.model} error: {str(e)}")
        raise Exception(f"Error translating report...")
