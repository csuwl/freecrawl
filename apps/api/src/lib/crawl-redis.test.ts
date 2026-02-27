import { generateURLPermutations } from "./crawl-redis";

describe("generateURLPermutations", () => {
  it("generates permutations correctly", () => {
    const bareHttps = generateURLPermutations("https://freecrawl.dev").map(
      x => x.href,
    );
    expect(bareHttps.length).toBe(16);
    expect(bareHttps.includes("https://freecrawl.dev/")).toBe(true);
    expect(bareHttps.includes("https://freecrawl.dev/index.html")).toBe(true);
    expect(bareHttps.includes("https://freecrawl.dev/index.php")).toBe(true);
    expect(bareHttps.includes("https://www.freecrawl.dev/")).toBe(true);
    expect(bareHttps.includes("https://www.freecrawl.dev/index.html")).toBe(
      true,
    );
    expect(bareHttps.includes("https://www.freecrawl.dev/index.php")).toBe(
      true,
    );
    expect(bareHttps.includes("http://freecrawl.dev/")).toBe(true);
    expect(bareHttps.includes("http://freecrawl.dev/index.html")).toBe(true);
    expect(bareHttps.includes("http://freecrawl.dev/index.php")).toBe(true);
    expect(bareHttps.includes("http://www.freecrawl.dev/")).toBe(true);
    expect(bareHttps.includes("http://www.freecrawl.dev/index.html")).toBe(
      true,
    );
    expect(bareHttps.includes("http://www.freecrawl.dev/index.php")).toBe(true);

    const bareHttp = generateURLPermutations("http://freecrawl.dev").map(
      x => x.href,
    );
    expect(bareHttp.length).toBe(16);
    expect(bareHttp.includes("https://freecrawl.dev/")).toBe(true);
    expect(bareHttp.includes("https://freecrawl.dev/index.html")).toBe(true);
    expect(bareHttp.includes("https://freecrawl.dev/index.php")).toBe(true);
    expect(bareHttp.includes("https://www.freecrawl.dev/")).toBe(true);
    expect(bareHttp.includes("https://www.freecrawl.dev/index.html")).toBe(
      true,
    );
    expect(bareHttp.includes("https://www.freecrawl.dev/index.php")).toBe(true);
    expect(bareHttp.includes("http://freecrawl.dev/")).toBe(true);
    expect(bareHttp.includes("http://freecrawl.dev/index.html")).toBe(true);
    expect(bareHttp.includes("http://freecrawl.dev/index.php")).toBe(true);
    expect(bareHttp.includes("http://www.freecrawl.dev/")).toBe(true);
    expect(bareHttp.includes("http://www.freecrawl.dev/index.html")).toBe(true);
    expect(bareHttp.includes("http://www.freecrawl.dev/index.php")).toBe(true);

    const wwwHttps = generateURLPermutations("https://www.freecrawl.dev").map(
      x => x.href,
    );
    expect(wwwHttps.length).toBe(16);
    expect(wwwHttps.includes("https://freecrawl.dev/")).toBe(true);
    expect(wwwHttps.includes("https://freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttps.includes("https://freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttps.includes("https://www.freecrawl.dev/")).toBe(true);
    expect(wwwHttps.includes("https://www.freecrawl.dev/index.html")).toBe(
      true,
    );
    expect(wwwHttps.includes("https://www.freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttps.includes("http://freecrawl.dev/")).toBe(true);
    expect(wwwHttps.includes("http://freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttps.includes("http://freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttps.includes("http://www.freecrawl.dev/")).toBe(true);
    expect(wwwHttps.includes("http://www.freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttps.includes("http://www.freecrawl.dev/index.php")).toBe(true);

    const wwwHttp = generateURLPermutations("http://www.freecrawl.dev").map(
      x => x.href,
    );
    expect(wwwHttp.length).toBe(16);
    expect(wwwHttp.includes("https://freecrawl.dev/")).toBe(true);
    expect(wwwHttp.includes("https://freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttp.includes("https://freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttp.includes("https://www.freecrawl.dev/")).toBe(true);
    expect(wwwHttp.includes("https://www.freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttp.includes("https://www.freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttp.includes("http://freecrawl.dev/")).toBe(true);
    expect(wwwHttp.includes("http://freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttp.includes("http://freecrawl.dev/index.php")).toBe(true);
    expect(wwwHttp.includes("http://www.freecrawl.dev/")).toBe(true);
    expect(wwwHttp.includes("http://www.freecrawl.dev/index.html")).toBe(true);
    expect(wwwHttp.includes("http://www.freecrawl.dev/index.php")).toBe(true);
  });
});
