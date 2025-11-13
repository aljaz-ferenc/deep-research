from agents import Agent, function_tool, Runner
from bs4 import BeautifulSoup
import requests


@function_tool
def url_scrape(url: str) -> str:
    """
    Scrapes a website for it's contents given a url
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        try:
            soup = BeautifulSoup(response.text, "html.parser")

            for script in soup(["script", "style"]):
                script.extract()

            text = soup.get_text(separator=" ", strip=True)

            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = " ".join(chunk for chunk in chunks if chunk)

            return text[:5000] if len(text) > 5000 else text
        except ImportError:
            return response.text[:5000]
    except Exception as e:
        return f"Failed to scrape content from {url}: {str(e)}"


SUMMARY_WORD_COUNT = 100

instructions = (
    "You are a research assistant. Given a URL, you will analyze the content of the URL "
    f"and produce a concise summary of the information. The summary must be around {SUMMARY_WORD_COUNT} words long."
    "Capture the main points. Write succinctly, no need to have complete sentences or perfect "
    "grammar. This will be consumed by someone synthesizing a report, so it's vital you capture the "
    "essence and ignore any fluff. Do not include any additional commentary other than the summary "
    "itself."
)

scraper = Agent(
    name="Scraper Agent",
    instructions=instructions,
    tools=[url_scrape],
    model="gpt-4o-mini",
)


async def run_scraper(original_query: str, urls):
    try:
        summaries = f"Original query: {original_query}\n\n"

        for index, url in enumerate(urls):
            scrape_result = await Runner.run(scraper, input=url["url"])
            summaries += (
                f"{index + 1}. {scrape_result.final_output}\n Source: {url['url']}\n\n"
            )

        return summaries
    except Exception as e:
        print(f"{scraper.model} error: {str(e)}")
        raise Exception("Error scraping data...")
