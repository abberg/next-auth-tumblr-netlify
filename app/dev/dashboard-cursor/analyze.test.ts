import { describe, expect, it } from 'vitest';
import { analyzeCursor } from './analyze';

describe('cursor evidence', () => {
  it('recognizes continuation without losing precision for large IDs', () => {
    expect(
      analyzeCursor(
        '9007199254740993',
        ['9007199254740992'],
        ['9007199254740992']
      )
    ).toMatchObject({ allBeforeAnchor: true, matchesKnownContinuation: true });
  });
  it('rejects an ignored cursor and an inclusive cursor', () => {
    expect(analyzeCursor('10', ['12', '11'])).toMatchObject({
      allBeforeAnchor: false,
    });
    expect(analyzeCursor('10', ['10', '9'])).toMatchObject({
      allBeforeAnchor: false,
      containsAnchor: true,
    });
  });
  it('does not treat an empty response as evidence of cursor support', () => {
    expect(analyzeCursor('10', [], ['9'])).toMatchObject({
      allBeforeAnchor: false,
      matchesKnownContinuation: false,
    });
  });
  it('requires the known continuation to appear in order', () => {
    expect(
      analyzeCursor('10', ['8', '9'], ['9', '8']).matchesKnownContinuation
    ).toBe(false);
  });
});
