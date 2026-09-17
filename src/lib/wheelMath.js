// Pure, DOM-free math for the roulette wheel: which segment ends up under the
// fixed pointer after a spin, and how far to spin. Kept separate from
// RouletteWheel.jsx (canvas rendering + rAF animation) so it can be unit
// tested directly, without mocking canvas/rAF/Web Audio.

const TWO_PI = 2 * Math.PI;

/**
 * The wheel is drawn with segment `i` occupying the canvas-space angle range
 * [i * arcSize, (i + 1) * arcSize) before any rotation is applied, and the
 * pointer is fixed at canvas angle 0 (the wheel rotates under it, not the
 * other way round). After spinning to `finalRotation` radians, this returns
 * the index of the segment sitting under the pointer.
 *
 * @param {number} finalRotation - total rotation applied to the wheel, in
 *   radians. Can be any real number (including negative or > 2*PI).
 * @param {number} segmentCount - number of options/segments on the wheel.
 * @returns {number} the winning segment index (0-based), or -1 if
 *   segmentCount is not a positive integer.
 */
export function computeWinnerIndex(finalRotation, segmentCount) {
  if (!Number.isFinite(finalRotation) || !Number.isInteger(segmentCount) || segmentCount <= 0) {
    return -1;
  }

  const arcSize = TWO_PI / segmentCount;
  // Normalize into [0, 2*PI) - JS `%` can return a negative result for a
  // negative dividend, so add TWO_PI and mod again.
  const normalizedRotation = ((finalRotation % TWO_PI) + TWO_PI) % TWO_PI;

  return Math.floor((TWO_PI - normalizedRotation) / arcSize) % segmentCount;
}

/**
 * Picks how far (in radians) the wheel should spin from its current
 * rotation: always 5-10 full turns plus the fractional part that lands on
 * the final winning angle. Using an integer number of "extra" turns
 * (`extraTurns`) multiplied by a uniform [0, 1) random value keeps the final
 * resting angle uniformly distributed - see wheelMath.test.js for a
 * statistical check that no segment is favored.
 *
 * @param {number} currentRotation - the wheel's current rotation, radians.
 * @param {() => number} [random] - source of randomness, defaults to
 *   Math.random. Injectable for deterministic tests.
 * @param {number} [minTurns]
 * @param {number} [extraTurns] - must be a positive integer for the final
 *   angle to be uniformly distributed.
 */
export function randomSpinTarget(currentRotation, random = Math.random, minTurns = 5, extraTurns = 5) {
  const spins = minTurns + random() * extraTurns;
  return currentRotation + spins * TWO_PI;
}
