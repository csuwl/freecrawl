# Swarm Freecrawl Marketing Agent

A multi-agent system using [OpenAI Swarm](https://github.com/openai/swarm) for AI-powered marketing strategies using [Freecrawl](https://freecrawl.dev) for web scraping.

## Agents

1. User Interface: Manages user interactions
2. Website Scraper: Extracts clean LLM-ready content via Freecrawl API
3. Analyst: Provides marketing insights
4. Campaign Idea: Generates marketing campaign concepts
5. Copywriter: Creates compelling marketing copy

## Requirements

- [Freecrawl](https://freecrawl.dev) API key
- [OpenAI](https://platform.openai.com/api-keys) API key

## Setup

1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. Set up your environment variables in a `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key
   FIRECRAWL_API_KEY=your_freecrawl_api_key
   ```

## Usage

Run the main script to start the interactive demo:

```
python main.py
```