import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const CLI = new URL('../bin/c7.js', import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

function run(...args) {
  return spawnSync('node', [CLI, ...args], { encoding: 'utf8' });
}

// ── 1. Version ──────────────────────────────────────────────

describe('version', () => {
  it('--version prints semver and exits 0', () => {
    const r = run('--version');
    assert.equal(r.status, 0);
    assert.match(r.stdout, /^\d+\.\d+\.\d+/);
    assert.equal(r.stdout.trim(), pkg.version);
  });

  it('-v is an alias for --version', () => {
    const r = run('-v');
    assert.equal(r.status, 0);
    assert.match(r.stdout, /^\d+\.\d+\.\d+/);
    assert.equal(r.stdout.trim(), pkg.version);
  });
});

// ── 2. Help ─────────────────────────────────────────────────

describe('help', () => {
  it('--help shows help text containing context7 and exits 0', () => {
    const r = run('--help');
    assert.equal(r.status, 0);
    assert.ok(r.stdout.includes('context7'));
  });

  it('-h is an alias for --help', () => {
    const r = run('-h');
    assert.equal(r.status, 0);
    assert.ok(r.stdout.includes('context7'));
  });

  it('no args shows help text with Usage and exits 0', () => {
    const r = run();
    assert.equal(r.status, 0);
    assert.ok(r.stdout.includes('Usage'));
  });
});

// ── 3. Error handling ───────────────────────────────────────

describe('error handling', () => {
  it('resolve with no library arg prints usage to stderr and exits 1', () => {
    const r = run('resolve');
    assert.equal(r.status, 1);
    assert.ok(r.stderr.includes('Usage'));
  });

  it('docs with no library arg prints usage to stderr and exits 1', () => {
    const r = run('docs');
    assert.equal(r.status, 1);
    assert.ok(r.stderr.includes('Usage'));
  });
});

// ── 4. Network / deprecation tests (opt-in) ────────────────

describe('network tests', { skip: !process.env.CONTEXT7_INTEGRATION }, () => {
  it('docs with --tokens warns about deprecation', () => {
    const r = run('docs', 'react', 'hooks', '--tokens', '5000');
    assert.match(r.stderr, /deprecated/i);
  });

  it('resolve react exits 0 and returns output', () => {
    const r = run('resolve', 'react');
    assert.equal(r.status, 0);
    assert.ok(r.stdout.length > 0);
  });

  it('docs with context7 id returns content', () => {
    const r = run('docs', '/vercel/next.js', 'hooks');
    assert.equal(r.status, 0);
    assert.ok(r.stdout.length > 0);
  });
});
