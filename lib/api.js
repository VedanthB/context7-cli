import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const BASE = process.env.CONTEXT7_API_URL || 'https://context7.com/api';

function makeHeaders(apiKey) {
  const h = {
    'X-Context7-Source': 'cli',
    'X-Context7-Server-Version': pkg.version,
  };
  if (apiKey) h['Authorization'] = `Bearer ${apiKey}`;
  return h;
}

function parseErrorResponse(resp, apiKey) {
  const status = resp.status;
  if (status === 429) {
    return apiKey
      ? 'Rate limited or quota exceeded. Upgrade your plan at https://context7.com/pricing for more requests.'
      : 'Rate limited or quota exceeded. Create a free API key at https://context7.com/pricing for more requests.';
  }
  if (status === 404) {
    return 'The library you are trying to access does not exist in the Context7 database. Please check the library ID and try again.';
  }
  if (status === 401) {
    return 'Invalid API key. Please check your API key and try again.';
  }
  return `Request failed with status ${status}. Please try again later.`;
}

export function trustScoreLabel(score) {
  if (score === undefined || score === null) return 'Unknown';
  if (score >= 7) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

export function formatSearchResult(result) {
  const lines = [];
  if (result.title) lines.push(`- Title: ${result.title}`);
  if (result.id) lines.push(`- Context7-compatible library ID: ${result.id}`);
  if (result.description) lines.push(`- Description: ${result.description}`);
  if (result.totalSnippets !== undefined && result.totalSnippets !== -1) {
    lines.push(`- Code Snippets: ${result.totalSnippets}`);
  }
  if (result.trustScore !== undefined && result.trustScore !== null) {
    lines.push(`- Source Reputation: ${trustScoreLabel(result.trustScore)}`);
  }
  if (result.benchmarkScore !== undefined && result.benchmarkScore !== 0) {
    lines.push(`- Benchmark Score: ${result.benchmarkScore}`);
  }
  if (result.versions && result.versions.length > 0) {
    lines.push(`- Versions: ${result.versions.join(', ')}`);
  }
  return lines.join('\n');
}

export function formatSearchResults(results) {
  if (!results || results.length === 0) return null;
  const formatted = results.map(formatSearchResult).join('\n----------\n');
  return `Available Libraries:\n\n${formatted}`;
}

export async function resolve(libraryName, apiKey, query) {
  const q = query || libraryName;
  const params = new URLSearchParams({ query: q, libraryName });
  const url = `${BASE}/v2/libs/search?${params}`;
  const resp = await fetch(url, { headers: makeHeaders(apiKey) });
  if (!resp.ok) throw new Error(parseErrorResponse(resp, apiKey));
  const data = await resp.json();
  return data.results || [];
}

export async function getDocs(libraryId, query, apiKey) {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  params.set('libraryId', libraryId);

  const url = `${BASE}/v2/context?${params}`;
  const resp = await fetch(url, { headers: makeHeaders(apiKey) });
  if (!resp.ok) throw new Error(parseErrorResponse(resp, apiKey));
  const text = await resp.text();
  if (!text || text.trim() === '') {
    throw new Error('Documentation not found or not finalized for this library. The library may still be processing. Please try again later.');
  }
  return text;
}
