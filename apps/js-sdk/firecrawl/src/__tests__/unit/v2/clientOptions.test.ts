import { Freecrawl, type FreecrawlClientOptions } from '../../../index';

describe('Freecrawl v2 Client Options', () => {
  it('should accept v2 options including timeoutMs, maxRetries, and backoffFactor', () => {
    const options: FreecrawlClientOptions = {
      apiKey: 'test-key',
      timeoutMs: 300,
      maxRetries: 5,
      backoffFactor: 0.5,
    };

    // Should not throw any type errors
    const client = new Freecrawl(options);
    
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Freecrawl);
  });

  it('should work with minimal options', () => {
    const options: FreecrawlClientOptions = {
      apiKey: 'test-key',
    };

    const client = new Freecrawl(options);
    
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Freecrawl);
  });

  it('should work with all v2 options', () => {
    const options: FreecrawlClientOptions = {
      apiKey: 'test-key',
      apiUrl: 'https://custom-api.freecrawl.dev',
      timeoutMs: 60000,
      maxRetries: 3,
      backoffFactor: 1.0,
    };

    const client = new Freecrawl(options);
    
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Freecrawl);
  });

  it('should export FreecrawlClientOptions type', () => {
    // This test ensures the type is properly exported
    const options: FreecrawlClientOptions = {
      apiKey: 'test-key',
      timeoutMs: 300,
    };

    expect(options.timeoutMs).toBe(300);
    expect(options.apiKey).toBe('test-key');
  });
});
