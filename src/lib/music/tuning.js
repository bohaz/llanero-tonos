import { CHROMATIC_NOTES } from "./notes";

export function normalizeFrequency(freq) {
  while (freq > 520) freq /= 2;
  while (freq < 130) freq *= 2;
  return freq;
}

export function findClosestNote(freq) {
  let closest = CHROMATIC_NOTES[0];
  let minDiff = Math.abs(freq - closest.freq);

  for (const n of CHROMATIC_NOTES) {
    const diff = Math.abs(freq - n.freq);
    if (diff < minDiff) {
      minDiff = diff;
      closest = n;
    }
  }

  return {
    note: closest.note,
    targetFreq: closest.freq,
    diff: freq - closest.freq,
  };
}
