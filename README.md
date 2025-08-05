# Deep Research

## Agentic AI Deep Research App
An AI-powered tool that generates comprehensive research reports from a single user prompt using a multi-agent pipeline.

### Tech Stack
**Backend**: Python, FastAPI, OpenAI Agents SDK

**Frontend**: React, TailwindCSS, Shadcn, react-hook-form, zod, zustand

### Features
- **Automated Multi-Agent Pipeline** – Each agent has a specialized role, from generating queries to compiling the final report.

- **Real-Time Progress Updates** – Users see exactly which step the system is on (query generation, web search, scraping, or report building).

- **Structured, High-Quality Reports** – Synthesized and formatted for readability and clarity.

- **PDF Export** – Generate a print-ready version of the research report.

- **Modern Frontend Experience** – Built with React, TailwindCSS, and Shadcn for a clean and responsive UI.

- **Robust Validation & State Management** – Uses react-hook-form, Zod, and Zustand for reliable form handling and global state.


## How it Works
The user provides a topic or concept to research. Their input is passed through a series of **AI Agents**, each with its own role, instructions on which **LLM** to use, and the **expected data format**:

1. `queries_generator Agent`:
    
    Breaks the user’s input into multiple research questions and explains its reasoning why each question is relevant to building the final report.

2. `web_searcher` Agent:
    
    Uses the WebSearch tool to find reliable pages and data sources that may answer the generated questions.

3. `scraper` Agent:

    Scraped the URLs to find and extract the most relevant data that will be used to build the final report.

4. `report_builder` Agent:

    Synthesizes the collected data into a well-structured, formatted research report that includes a table of contents, introduction, main body, conclusion and references.

The user sees real-time progress (query generation → web search → scraping → report creation) and can export the completed report as a PDF.

## Try It Out
[Live Page](https://af-deep-research.netlify.app/)
