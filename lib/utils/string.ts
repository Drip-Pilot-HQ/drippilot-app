/**
 * Natural sort comparison function that handles embedded numbers correctly.
 *
 * Examples:
 * - "Day 3" comes before "Day 11"
 * - "Email 2" comes before "Email 10"
 * - "1 Day - Text 2" comes before "3 Day Follow-up"
 *
 * @param a First string to compare
 * @param b Second string to compare
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function naturalSort(a: string, b: string): number {
  // Convert to lowercase for case-insensitive comparison
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  // Split strings into chunks of text and numbers
  const aChunks = aLower.match(/(\d+|\D+)/g) || [];
  const bChunks = bLower.match(/(\d+|\D+)/g) || [];

  const maxLength = Math.max(aChunks.length, bChunks.length);

  for (let i = 0; i < maxLength; i++) {
    const aChunk = aChunks[i] || "";
    const bChunk = bChunks[i] || "";

    // Check if both chunks are numbers
    const aIsNumber = /^\d+$/.test(aChunk);
    const bIsNumber = /^\d+$/.test(bChunk);

    if (aIsNumber && bIsNumber) {
      // Compare as numbers
      const diff = parseInt(aChunk, 10) - parseInt(bChunk, 10);
      if (diff !== 0) return diff;
    } else {
      // Compare as strings
      const diff = aChunk.localeCompare(bChunk);
      if (diff !== 0) return diff;
    }
  }

  return 0;
}
