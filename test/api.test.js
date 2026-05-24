import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  resolve,
  getDocs,
  formatSearchResult,
  formatSearchResults,
  trustScoreLabel,
} from '../lib/api.js';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetch(overrides = {}) {
  const defaults = {
    ok: true,
    status: 200,
    json: async () => ({ results: [] }),
    text: async () => '',
  };
  const resp = { ...defaults, ...overrides };
  globalThis.fetch = mock.fn(async () => resp);
  return globalThis.fetch;
}

// ---------------------------------------------------------------------------
// resolve()
// ---------------------------------------------------------------------------

describe('resolve()', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('constructs the correct URL with base + /v2/libs/search', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined);
    const calledUrl = fetchMock.mock.calls[0].arguments[0];
    assert.ok(calledUrl.startsWith('https://context7.com/api/v2/libs/search?'));
  });

  it('includes query and libraryName as URL params', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined);
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.searchParams.get('libraryName'), 'react');
    assert.equal(calledUrl.searchParams.get('query'), 'react');
  });

  it('defaults query to libraryName when query is not provided', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('vue', undefined);
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.searchParams.get('query'), 'vue');
  });

  it('uses custom query when provided as 3rd argument', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined, 'hooks tutorial');
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.searchParams.get('query'), 'hooks tutorial');
    assert.equal(calledUrl.searchParams.get('libraryName'), 'react');
  });

  it('sends X-Context7-Source header as "cli"', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined);
    const headers = fetchMock.mock.calls[0].arguments[1].headers;
    assert.equal(headers['X-Context7-Source'], 'cli');
  });

  it('sends X-Context7-Server-Version header matching package.json version', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined);
    const headers = fetchMock.mock.calls[0].arguments[1].headers;
    assert.equal(headers['X-Context7-Server-Version'], pkg.version);
  });

  it('includes Authorization header when apiKey is provided', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', 'my-secret-key');
    const headers = fetchMock.mock.calls[0].arguments[1].headers;
    assert.equal(headers['Authorization'], 'Bearer my-secret-key');
  });

  it('omits Authorization header when apiKey is not provided', async () => {
    const fetchMock = mockFetch({ json: async () => ({ results: [] }) });
    await resolve('react', undefined);
    const headers = fetchMock.mock.calls[0].arguments[1].headers;
    assert.equal(headers['Authorization'], undefined);
  });

  it('parses results from response JSON .results', async () => {
    const expected = [{ id: '/lib/react', title: 'React' }];
    mockFetch({ json: async () => ({ results: expected }) });
    const results = await resolve('react', undefined);
    assert.deepEqual(results, expected);
  });

  it('returns empty array when results is missing from response', async () => {
    mockFetch({ json: async () => ({}) });
    const results = await resolve('react', undefined);
    assert.deepEqual(results, []);
  });

  it('throws rate-limit message with upgrade hint when 429 and apiKey provided', async () => {
    mockFetch({ ok: false, status: 429 });
    await assert.rejects(
      () => resolve('react', 'my-key'),
      { message: 'Rate limited or quota exceeded. Upgrade your plan at https://context7.com/pricing for more requests.' }
    );
  });

  it('throws rate-limit message with create-key hint when 429 and no apiKey', async () => {
    mockFetch({ ok: false, status: 429 });
    await assert.rejects(
      () => resolve('react', undefined),
      { message: 'Rate limited or quota exceeded. Create a free API key at https://context7.com/pricing for more requests.' }
    );
  });

  it('throws library-not-found message on 404', async () => {
    mockFetch({ ok: false, status: 404 });
    await assert.rejects(
      () => resolve('nonexistent', undefined),
      { message: 'The library you are trying to access does not exist in the Context7 database. Please check the library ID and try again.' }
    );
  });

  it('throws invalid-API-key message on 401', async () => {
    mockFetch({ ok: false, status: 401 });
    await assert.rejects(
      () => resolve('react', 'bad-key'),
      { message: 'Invalid API key. Please check your API key and try again.' }
    );
  });

  it('throws generic status message on other error codes (500)', async () => {
    mockFetch({ ok: false, status: 500 });
    await assert.rejects(
      () => resolve('react', undefined),
      { message: 'Request failed with status 500. Please try again later.' }
    );
  });
});

// ---------------------------------------------------------------------------
// resolve() — CONTEXT7_API_URL env var override
// ---------------------------------------------------------------------------

describe('resolve() with CONTEXT7_API_URL env var', () => {
  it('uses custom base URL from CONTEXT7_API_URL', async () => {
    // Because BASE is captured at module load time, we must dynamically
    // re-import the module with the env var set. We use a query string
    // cache-buster to bypass Node's module cache.
    const original = process.env.CONTEXT7_API_URL;
    const originalFetch = globalThis.fetch;
    try {
      process.env.CONTEXT7_API_URL = 'https://custom.example.com/api';
      const fakeFetch = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ results: [] }),
      }));
      globalThis.fetch = fakeFetch;

      const freshModule = await import(`../lib/api.js?bust=${Date.now()}`);
      await freshModule.resolve('react', undefined);

      const calledUrl = fakeFetch.mock.calls[0].arguments[0];
      assert.ok(
        calledUrl.startsWith('https://custom.example.com/api/v2/libs/search?'),
        `Expected URL to start with custom base, got: ${calledUrl}`
      );
    } finally {
      if (original === undefined) delete process.env.CONTEXT7_API_URL;
      else process.env.CONTEXT7_API_URL = original;
      globalThis.fetch = originalFetch;
    }
  });
});

// ---------------------------------------------------------------------------
// getDocs()
// ---------------------------------------------------------------------------

describe('getDocs()', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('constructs the correct URL with /v2/context and libraryId param', async () => {
    const fetchMock = mockFetch({ text: async () => 'docs content' });
    await getDocs('/lib/react', undefined, undefined);
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.pathname, '/api/v2/context');
    assert.equal(calledUrl.searchParams.get('libraryId'), '/lib/react');
  });

  it('includes query param when query is provided', async () => {
    const fetchMock = mockFetch({ text: async () => 'docs content' });
    await getDocs('/lib/react', 'useState hooks', undefined);
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.searchParams.get('query'), 'useState hooks');
  });

  it('omits query param when query is not provided', async () => {
    const fetchMock = mockFetch({ text: async () => 'docs content' });
    await getDocs('/lib/react', undefined, undefined);
    const calledUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    assert.equal(calledUrl.searchParams.has('query'), false);
  });

  it('returns plain text response on success', async () => {
    mockFetch({ text: async () => '# React Docs\nSome content here.' });
    const result = await getDocs('/lib/react', 'hooks', undefined);
    assert.equal(result, '# React Docs\nSome content here.');
  });

  it('throws "Documentation not found" on empty response', async () => {
    mockFetch({ text: async () => '' });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', undefined),
      { message: /Documentation not found/ }
    );
  });

  it('throws "Documentation not found" on whitespace-only response', async () => {
    mockFetch({ text: async () => '   \n\t  ' });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', undefined),
      { message: /Documentation not found/ }
    );
  });

  it('throws rate-limit message with upgrade hint when 429 and apiKey provided', async () => {
    mockFetch({ ok: false, status: 429 });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', 'my-key'),
      { message: /Upgrade your plan/ }
    );
  });

  it('throws rate-limit message with create-key hint when 429 and no apiKey', async () => {
    mockFetch({ ok: false, status: 429 });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', undefined),
      { message: /Create a free API key/ }
    );
  });

  it('throws library-not-found message on 404', async () => {
    mockFetch({ ok: false, status: 404 });
    await assert.rejects(
      () => getDocs('/lib/nonexistent', 'hooks', undefined),
      { message: /does not exist/ }
    );
  });

  it('throws invalid-API-key message on 401', async () => {
    mockFetch({ ok: false, status: 401 });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', 'bad-key'),
      { message: /Invalid API key/ }
    );
  });

  it('throws generic status message on other error codes (502)', async () => {
    mockFetch({ ok: false, status: 502 });
    await assert.rejects(
      () => getDocs('/lib/react', 'hooks', undefined),
      { message: 'Request failed with status 502. Please try again later.' }
    );
  });
});

// ---------------------------------------------------------------------------
// formatSearchResult()
// ---------------------------------------------------------------------------

describe('formatSearchResult()', () => {
  it('formats all fields when present', () => {
    const result = formatSearchResult({
      title: 'React',
      id: '/lib/react',
      description: 'A JavaScript library for building user interfaces',
      totalSnippets: 150,
      trustScore: 9,
      benchmarkScore: 85,
      versions: ['18.2.0', '18.3.0'],
    });
    assert.ok(result.includes('- Title: React'));
    assert.ok(result.includes('- Context7-compatible library ID: /lib/react'));
    assert.ok(result.includes('- Description: A JavaScript library for building user interfaces'));
    assert.ok(result.includes('- Code Snippets: 150'));
    assert.ok(result.includes('- Source Reputation: High'));
    assert.ok(result.includes('- Benchmark Score: 85'));
    assert.ok(result.includes('- Versions: 18.2.0, 18.3.0'));
  });

  it('hides Code Snippets line when totalSnippets is -1', () => {
    const result = formatSearchResult({
      title: 'React',
      id: '/lib/react',
      totalSnippets: -1,
    });
    assert.ok(!result.includes('Code Snippets'));
  });

  it('hides Code Snippets line when totalSnippets is undefined', () => {
    const result = formatSearchResult({
      title: 'React',
      id: '/lib/react',
    });
    assert.ok(!result.includes('Code Snippets'));
  });

  it('shows "High" reputation when trustScore >= 7', () => {
    const result = formatSearchResult({ title: 'X', trustScore: 7 });
    assert.ok(result.includes('Source Reputation: High'));
  });

  it('shows "Medium" reputation when trustScore >= 4 and < 7', () => {
    const result = formatSearchResult({ title: 'X', trustScore: 5 });
    assert.ok(result.includes('Source Reputation: Medium'));
  });

  it('shows "Low" reputation when trustScore < 4', () => {
    const result = formatSearchResult({ title: 'X', trustScore: 2 });
    assert.ok(result.includes('Source Reputation: Low'));
  });

  it('hides Source Reputation line when trustScore is undefined', () => {
    const result = formatSearchResult({ title: 'X' });
    assert.ok(!result.includes('Source Reputation'));
  });

  it('hides Source Reputation line when trustScore is null', () => {
    const result = formatSearchResult({ title: 'X', trustScore: null });
    assert.ok(!result.includes('Source Reputation'));
  });

  it('hides Benchmark Score line when benchmarkScore is 0', () => {
    const result = formatSearchResult({ title: 'X', benchmarkScore: 0 });
    assert.ok(!result.includes('Benchmark Score'));
  });

  it('hides Benchmark Score line when benchmarkScore is undefined', () => {
    const result = formatSearchResult({ title: 'X' });
    assert.ok(!result.includes('Benchmark Score'));
  });

  it('hides Versions line when versions array is empty', () => {
    const result = formatSearchResult({ title: 'X', versions: [] });
    assert.ok(!result.includes('Versions'));
  });

  it('hides Versions line when versions is undefined', () => {
    const result = formatSearchResult({ title: 'X' });
    assert.ok(!result.includes('Versions'));
  });
});

// ---------------------------------------------------------------------------
// formatSearchResults()
// ---------------------------------------------------------------------------

describe('formatSearchResults()', () => {
  it('returns null for empty array', () => {
    assert.equal(formatSearchResults([]), null);
  });

  it('returns null for null input', () => {
    assert.equal(formatSearchResults(null), null);
  });

  it('returns null for undefined input', () => {
    assert.equal(formatSearchResults(undefined), null);
  });

  it('wraps results with "Available Libraries:" header', () => {
    const output = formatSearchResults([{ title: 'React', id: '/lib/react' }]);
    assert.ok(output.startsWith('Available Libraries:\n\n'));
  });

  it('joins multiple results with "----------" separator', () => {
    const output = formatSearchResults([
      { title: 'React', id: '/lib/react' },
      { title: 'Vue', id: '/lib/vue' },
    ]);
    assert.ok(output.includes('----------'));
    // Should have exactly one separator between two results
    const separatorCount = output.split('----------').length - 1;
    assert.equal(separatorCount, 1);
  });

  it('includes content from each result', () => {
    const output = formatSearchResults([
      { title: 'React', id: '/lib/react' },
      { title: 'Vue', id: '/lib/vue' },
    ]);
    assert.ok(output.includes('- Title: React'));
    assert.ok(output.includes('- Title: Vue'));
  });
});

// ---------------------------------------------------------------------------
// trustScoreLabel()
// ---------------------------------------------------------------------------

describe('trustScoreLabel()', () => {
  it('returns "High" for score >= 7', () => {
    assert.equal(trustScoreLabel(7), 'High');
    assert.equal(trustScoreLabel(10), 'High');
  });

  it('returns "Medium" for score >= 4 and < 7', () => {
    assert.equal(trustScoreLabel(4), 'Medium');
    assert.equal(trustScoreLabel(6), 'Medium');
  });

  it('returns "Low" for score < 4', () => {
    assert.equal(trustScoreLabel(3), 'Low');
    assert.equal(trustScoreLabel(0), 'Low');
    assert.equal(trustScoreLabel(-1), 'Low');
  });

  it('returns "Unknown" for undefined', () => {
    assert.equal(trustScoreLabel(undefined), 'Unknown');
  });

  it('returns "Unknown" for null', () => {
    assert.equal(trustScoreLabel(null), 'Unknown');
  });
});
