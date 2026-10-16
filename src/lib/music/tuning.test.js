import { describe, expect, it } from "vitest";
import {
  average,
  findClosestNote,
  isUsableReading,
  needleRotation,
  normalizeFrequency,
  pushReading,
  tuningStatus,
} from "./tuning";

describe("normalizeFrequency", () => {
  it("leaves frequencies inside the reference octave unchanged", () => {
    expect(normalizeFrequency(440)).toBe(440);
  });

  it("moves higher and lower octaves into the reference octave", () => {
    expect(normalizeFrequency(880)).toBe(440);
    expect(normalizeFrequency(110)).toBe(440);
  });

  it("recognizes low strings below the reference octave", () => {
    // These used to be read as DO because they stayed below the note table.
    expect(findClosestNote(normalizeFrequency(220)).note).toBe("LA");
    expect(findClosestNote(normalizeFrequency(196)).note).toBe("SOL");
    expect(findClosestNote(normalizeFrequency(246.94)).note).toBe("SI");
    expect(findClosestNote(normalizeFrequency(130.81)).note).toBe("DO");
  });

  it("keeps a slightly flat DO next to DO, not SI", () => {
    expect(findClosestNote(normalizeFrequency(258)).note).toBe("DO");
    expect(findClosestNote(normalizeFrequency(516)).note).toBe("DO");
  });

  it("rejects zero and negative values instead of looping forever", () => {
    expect(() => normalizeFrequency(0)).toThrow(RangeError);
    expect(() => normalizeFrequency(-10)).toThrow(RangeError);
  });
});

describe("findClosestNote", () => {
  it("finds an exact note", () => {
    expect(findClosestNote(440)).toEqual({
      note: "LA",
      targetFreq: 440,
      diff: 0,
    });
  });

  it("reports how far the reading is from the note", () => {
    const result = findClosestNote(443);
    expect(result.note).toBe("LA");
    expect(result.diff).toBeCloseTo(3);
  });

  it("detects sharps", () => {
    expect(findClosestNote(278).note).toBe("DO#");
  });
});

describe("isUsableReading", () => {
  it("accepts a clear reading in range", () => {
    expect(isUsableReading(440, 0.95)).toBe(true);
  });

  it("rejects unclear or out-of-range readings", () => {
    expect(isUsableReading(440, 0.5)).toBe(false);
    expect(isUsableReading(20, 0.95)).toBe(false);
    expect(isUsableReading(3000, 0.95)).toBe(false);
  });
});

describe("smoothing", () => {
  it("keeps only the most recent readings", () => {
    expect(pushReading([1, 2, 3], 4, 3)).toEqual([2, 3, 4]);
  });

  it("averages readings and handles an empty list", () => {
    expect(average([438, 442])).toBe(440);
    expect(average([])).toBeNull();
  });
});

describe("tuningStatus", () => {
  it.each([
    [null, "idle"],
    [0.5, "in-tune"],
    [-0.5, "in-tune"],
    [3, "sharp"],
    [-3, "flat"],
  ])("diff %s is %s", (diff, status) => {
    expect(tuningStatus(diff)).toBe(status);
  });
});

describe("needleRotation", () => {
  it("rests at the centre without a reading", () => {
    expect(needleRotation(null)).toBe(0);
  });

  it("is clamped to 45 degrees each way", () => {
    expect(needleRotation(5)).toBe(15);
    expect(needleRotation(100)).toBe(45);
    expect(needleRotation(-100)).toBe(-45);
  });
});
