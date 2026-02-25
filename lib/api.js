const BASE = 'https://context7.com/api/v1';

function headers(apiKey) {
  const h = { 'Content-Type': 'application/json' };
  if (apiKey) h['Authorization'] = `Bearer ${apiKey}`;
  return h;
}

export async function resolve(libraryName, apiKey) {
  const url = `${BASE}/search?query=${encodeURIComponent(libraryName)}&limit=10`;
  const resp = await fetch(url, { headers: headers(apiKey) });
  if (!resp.ok) throw new Error(`Search failed: ${resp.status}`);
  const data = await resp.json();
  return data.results || [];
}

export async function getDocs(libraryId, topic, apiKey, tokens = 5000) {
  const params = new URLSearchParams({ tokens: String(tokens) });
  if (topic) params.set('topic', topic);

  const url = `${BASE}${libraryId}?${params}`;
  const resp = await fetch(url, { headers: headers(apiKey) });
  if (!resp.ok) throw new Error(`Docs fetch failed: ${resp.status}`);
  const text = await resp.text();

  // Try JSON first, fall back to raw text (markdown)
  try {
    const data = JSON.parse(text);
    if (data.snippets?.length) {
      return data.snippets.map(s => {
        const header = s.title ? `## ${s.title}` : (s.filePath ? `## ${s.filePath}` : '');
        return [header, s.content].filter(Boolean).join('\n');
      }).join('\n\n---\n\n');
    }
    if (data.content) return data.content;
    return JSON.stringify(data, null, 2);
  } catch {
    return text;
  }
}
