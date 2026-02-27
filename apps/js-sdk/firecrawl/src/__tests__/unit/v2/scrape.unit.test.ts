/**
 * Minimal unit test for v2 scrape (no mocking; sanity check payload path)
 */
import { FreecrawlClient } from "../../../v2/client";

describe("v2.scrape unit", () => {
  test("constructor requires apiKey", () => {
    expect(() => new FreecrawlClient({ apiKey: "", apiUrl: "https://api.freecrawl.dev" })).toThrow();
  });
});

