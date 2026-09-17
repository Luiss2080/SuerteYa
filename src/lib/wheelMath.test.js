import { describe, it, expect } from 'vitest';
import { computeWinnerIndex, randomSpinTarget } from './wheelMath';

const TWO_PI = 2 * Math.PI;
const deg = (d) => (d * Math.PI) / 180;

describe('computeWinnerIndex', () => {
  it('returns segment 0 when the wheel has not rotated at all', () => {
    expect(computeWinnerIndex(0, 4)).toBe(0);
  });

  it('returns segment 0 for any exact multiple of a full turn', () => {
    expect(computeWinnerIndex(TWO_PI, 4)).toBe(0);
    expect(computeWinnerIndex(TWO_PI * 7, 6)).toBe(0);
  });

  it('matches a hand-derived example with 4 segments (90 deg arcs)', () => {
    // rotation = 10deg -> segment 3 occupies [280,360)u[0,10), which
    // contains the pointer at angle 0.
    expect(computeWinnerIndex(deg(10), 4)).toBe(3);
    // rotation = 95deg -> segment 2 occupies [275,360)u..., contains 0.
    expect(computeWinnerIndex(deg(95), 4)).toBe(2);
    // just under the next segment boundary, still segment 3.
    expect(computeWinnerIndex(deg(89.9999), 4)).toBe(3);
  });

  it('is stable across multiple full extra turns (a spin always adds turns)', () => {
    const base = deg(37);
    expect(computeWinnerIndex(base, 8)).toBe(computeWinnerIndex(base + TWO_PI * 3, 8));
  });

  it('handles negative rotation values without throwing or going out of range', () => {
    const idx = computeWinnerIndex(-deg(10), 4);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(4);
  });

  it('always returns a single fixed segment when there is only 1 option', () => {
    for (const rot of [0, deg(45), deg(359), TWO_PI * 12.34]) {
      expect(computeWinnerIndex(rot, 1)).toBe(0);
    }
  });

  it('never returns an out-of-range index for many segment counts and angles', () => {
    for (let n = 1; n <= 100; n++) {
      for (let step = 0; step < 20; step++) {
        const rot = (TWO_PI * step) / 20 + n * 0.013;
        const idx = computeWinnerIndex(rot, n);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(n);
        expect(Number.isInteger(idx)).toBe(true);
      }
    }
  });

  it('rejects invalid segment counts instead of returning NaN/Infinity', () => {
    expect(computeWinnerIndex(deg(10), 0)).toBe(-1);
    expect(computeWinnerIndex(deg(10), -3)).toBe(-1);
    expect(computeWinnerIndex(deg(10), 2.5)).toBe(-1);
    expect(computeWinnerIndex(NaN, 4)).toBe(-1);
    expect(computeWinnerIndex(Infinity, 4)).toBe(-1);
  });
});

describe('randomSpinTarget', () => {
  it('always adds between 5 and 10 full turns to the current rotation', () => {
    // Exercise the boundaries of the injected random source.
    const start = deg(20);
    const min = randomSpinTarget(start, () => 0);
    const max = randomSpinTarget(start, () => 0.999999999);

    expect(min).toBeCloseTo(start + 5 * TWO_PI, 5);
    expect(max).toBeCloseTo(start + 10 * TWO_PI, 4);
  });

  it('is monotonically increasing with the random draw', () => {
    const start = 0;
    const low = randomSpinTarget(start, () => 0.1);
    const high = randomSpinTarget(start, () => 0.9);
    expect(high).toBeGreaterThan(low);
  });
});

describe('spin randomness is not biased toward any segment', () => {
  // This is the core "is the wheel actually fair?" check requested in the
  // audit: run many simulated spins (deterministic pseudo-random sequence,
  // no flaky Math.random in CI) and assert the winners are close to
  // uniformly distributed across segments, for a couple of segment counts.
  const mulberry32 = (seed) => {
    let a = seed;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  it.each([2, 4, 5, 10])('is roughly uniform across %i segments over many spins', (segmentCount) => {
    const random = mulberry32(1234 + segmentCount);
    const trials = 20000;
    const counts = new Array(segmentCount).fill(0);

    let rotation = 0;
    for (let i = 0; i < trials; i++) {
      rotation = randomSpinTarget(rotation, random);
      const idx = computeWinnerIndex(rotation, segmentCount);
      counts[idx]++;
    }

    const expected = trials / segmentCount;
    for (const count of counts) {
      // Allow generous +/-20% slack - this is a bias smoke test, not a
      // precise statistical test, and must not be flaky in CI.
      expect(count).toBeGreaterThan(expected * 0.8);
      expect(count).toBeLessThan(expected * 1.2);
    }
  });
});
