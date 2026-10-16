import { describe, expect, it } from "vitest";
import { LOWER, RAISE, TRANSPORT_KEYS, calculateTransport } from "./transport";

describe("calculateTransport", () => {
  it("returns no steps for the same key", () => {
    expect(calculateTransport("RE", "RE")).toEqual([]);
  });

  it("raises one string half a tone for each step to the right", () => {
    expect(calculateTransport("RE", "LA")).toEqual([
      { string: "SOL", target: "SOL#", instruction: RAISE },
    ]);
  });

  it("lowers the same string when moving back one step", () => {
    expect(calculateTransport("LA", "RE")).toEqual([
      { string: "SOL#", target: "SOL", instruction: LOWER },
    ]);
  });

  it("lists every step, in order, across several keys", () => {
    expect(calculateTransport("DO", "RE")).toEqual([
      { string: "FA", target: "FA#", instruction: RAISE },
      { string: "DO", target: "DO#", instruction: RAISE },
    ]);
  });

  it("goes from FA to SI without wrapping around the scale", () => {
    const steps = calculateTransport("FA", "SI");

    expect(steps).toHaveLength(6);
    expect(steps.every((step) => step.instruction === RAISE)).toBe(true);
    expect(steps.map((step) => step.target)).toEqual([
      "SI",
      "FA#",
      "DO#",
      "SOL#",
      "RE#",
      "LA#",
    ]);
  });

  it("undoes a transport exactly when going back", () => {
    for (const from of TRANSPORT_KEYS) {
      for (const to of TRANSPORT_KEYS) {
        const there = calculateTransport(from, to);
        const back = calculateTransport(to, from);
        const undone = back.map((s) => ({
          string: s.target,
          target: s.string,
        }));

        expect(undone.reverse()).toEqual(
          there.map(({ string, target }) => ({ string, target })),
        );
      }
    }
  });

  it("rejects keys outside the transport scale", () => {
    expect(() => calculateTransport("DO#", "RE")).toThrow(/Unsupported key/);
  });
});
