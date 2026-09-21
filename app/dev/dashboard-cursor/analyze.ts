export function analyzeCursor(
  anchor: string,
  ids: string[],
  expected: string[] = []
) {
  const validIds = /^\d+$/.test(anchor) && ids.every((id) => /^\d+$/.test(id));
  return {
    count: ids.length,
    allBeforeAnchor:
      validIds &&
      ids.length > 0 &&
      ids.every((id) => BigInt(id) < BigInt(anchor)),
    containsAnchor: ids.includes(anchor),
    matchesKnownContinuation:
      expected.length > 0 && expected.every((id, index) => ids[index] === id),
    ids,
  };
}
