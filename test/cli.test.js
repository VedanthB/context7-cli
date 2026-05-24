import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseArgs, isContext7Id } from '../bin/c7.js';

describe('parseArgs()', () => {
  it('returns { _: [] } for empty args', () => {
    assert.deepStrictEqual(parseArgs([]), { _: [] });
  });

  it('collects positional args into _', () => {
    const result = parseArgs(['resolve', 'react']);
    assert.deepStrictEqual(result, { _: ['resolve', 'react'] });
  });

  it('parses --api-key with a value', () => {
    const result = parseArgs(['--api-key', 'mykey']);
    assert.deepStrictEqual(result, { apiKey: 'mykey', _: [] });
  });

  it('parses --tokens as an integer', () => {
    const result = parseArgs(['--tokens', '5000']);
    assert.deepStrictEqual(result, { tokens: 5000, _: [] });
  });

  it('parses --json as a boolean flag', () => {
    const result = parseArgs(['--json']);
    assert.deepStrictEqual(result, { json: true, _: [] });
  });

  it('parses --help as a boolean flag', () => {
    const result = parseArgs(['--help']);
    assert.deepStrictEqual(result, { help: true, _: [] });
  });

  it('parses -h as help', () => {
    const result = parseArgs(['-h']);
    assert.deepStrictEqual(result, { help: true, _: [] });
  });

  it('parses --version as a boolean flag', () => {
    const result = parseArgs(['--version']);
    assert.deepStrictEqual(result, { version: true, _: [] });
  });

  it('parses -v as version', () => {
    const result = parseArgs(['-v']);
    assert.deepStrictEqual(result, { version: true, _: [] });
  });

  it('handles mixed positional and flag args', () => {
    const result = parseArgs(['resolve', 'react', '--api-key', 'k', '--json']);
    assert.deepStrictEqual(result, {
      _: ['resolve', 'react'],
      apiKey: 'k',
      json: true,
    });
  });

  it('pushes --tokens to positionals when no value follows', () => {
    const result = parseArgs(['--tokens']);
    assert.deepStrictEqual(result, { _: ['--tokens'] });
  });

  it('pushes --api-key to positionals when no value follows', () => {
    const result = parseArgs(['--api-key']);
    assert.deepStrictEqual(result, { _: ['--api-key'] });
  });
});

describe('isContext7Id()', () => {
  it('returns true for /org/project (3 parts)', () => {
    assert.strictEqual(isContext7Id('/org/project'), true);
  });

  it('returns true for /org/project/version (4 parts)', () => {
    assert.strictEqual(isContext7Id('/org/project/version'), true);
  });

  it('returns false for a plain library name', () => {
    assert.strictEqual(isContext7Id('react'), false);
  });

  it('returns false for /foo (only 2 parts)', () => {
    assert.strictEqual(isContext7Id('/foo'), false);
  });

  it('returns false for an empty string', () => {
    assert.strictEqual(isContext7Id(''), false);
  });
});
