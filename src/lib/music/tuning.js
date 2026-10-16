import { CHROMATIC_NOTES } from "./chromaticNotes";

export const TUNER_SETTINGS = {
  /** Minimum pitch clarity (0–1) for a reading to count. */
  clarityThreshold: 0.85,
  /** Readings outside this range are treated as noise. */
  minFrequency: 50,
  maxFrequency: 1200,
  /** Number of recent readings averaged to steady the needle. */
  smoothingSize: 8,
  /** Minimum time between screen updates, in milliseconds. */
  updateInterval: 120,
  /** Difference, in Hz, still considered in tune. */
  inTuneRange: 1,
};

// The reference octave goes from a quarter tone below the first note of
// CHROMATIC_NOTES to just under the octave above that bound, so every reading
// lands next to a note in the table, whatever octave the string is in.
const QUARTER_TONE = 2 ** (1 / 24);
const OCTAVE_LOW = CHROMATIC_NOTES[0].freq / QUARTER_TONE;
const OCTAVE_HIGH = OCTAVE_LOW * 2;

/** Moves a frequency into the octave covered by CHROMATIC_NOTES. */
export function normalizeFrequency(freq) {
  if (!(freq > 0)) throw new RangeError("Frequency must be a positive number");

  let normalized = freq;
  while (normalized >= OCTAVE_HIGH) normalized /= 2;
  while (normalized < OCTAVE_LOW) normalized *= 2;
  return normalized;
}

export function findClosestNote(freq) {
  const closest = CHROMATIC_NOTES.reduce((best, candidate) =>
    Math.abs(freq - candidate.freq) < Math.abs(freq - best.freq)
      ? candidate
      : best,
  );

  return {
    note: closest.note,
    targetFreq: closest.freq,
    diff: freq - closest.freq,
  };
}

export function isUsableReading(freq, clarity, settings = TUNER_SETTINGS) {
  return (
    clarity > settings.clarityThreshold &&
    freq > settings.minFrequency &&
    freq < settings.maxFrequency
  );
}

/** Adds a reading and keeps only the most recent `size` values. */
export function pushReading(
  history,
  reading,
  size = TUNER_SETTINGS.smoothingSize,
) {
  return [...history, reading].slice(-size);
}

export function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** @returns {"idle" | "in-tune" | "sharp" | "flat"} */
export function tuningStatus(diff, range = TUNER_SETTINGS.inTuneRange) {
  if (diff === null || diff === undefined) return "idle";
  if (Math.abs(diff) < range) return "in-tune";
  return diff > 0 ? "sharp" : "flat";
}

const MAX_NEEDLE_ANGLE = 45;
const DEGREES_PER_HZ = 3;

/** Needle angle in degrees, clamped to ±45. */
export function needleRotation(diff) {
  if (!diff) return 0;
  return Math.max(
    -MAX_NEEDLE_ANGLE,
    Math.min(MAX_NEEDLE_ANGLE, diff * DEGREES_PER_HZ),
  );
}
