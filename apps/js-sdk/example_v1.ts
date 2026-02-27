// Placeholder v1 example (TypeScript)
// Mirrors the older SDK usage. Replace with your API key before running.

// import FreecrawlApp from 'freecrawl';
import Freecrawl from './freecrawl/src/index'

async function main() {
  const app = new Freecrawl({ apiKey: process.env.FIRECRAWL_API_KEY || 'fc-YOUR_API_KEY' });

  // Scrape a website (v1 style):
  const scrape = await app.v1.scrapeUrl('freecrawl.dev');
  if ((scrape as any).success) console.log((scrape as any).markdown);

  // Crawl a website (v1 style):
  const crawl = await app.v1.crawlUrl('mendable.ai', { excludePaths: ['blog/*'], limit: 3 });
  console.log(crawl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

