/**
 * Retuning a diatonic llanero harp from one key to another.
 *
 * Keys are ordered by fifths. Moving one step to the right adds a sharp, so a
 * single string goes up half a tone; moving one step to the left removes it,
 * so that string goes back down. The order does not wrap around: after SI the
 * next key would be FA#, not FA.
 */
export const TRANSPORT_KEYS = ["FA", "DO", "SOL", "RE", "LA", "MI", "SI"];

/** String that changes when moving one step to the right, from each key. */
const STEP_UP = {
  FA: { string: "LA#", target: "SI" },
  DO: { string: "FA", target: "FA#" },
  SOL: { string: "DO", target: "DO#" },
  RE: { string: "SOL", target: "SOL#" },
  LA: { string: "RE", target: "RE#" },
  MI: { string: "LA", target: "LA#" },
};

export const RAISE = "Subir ½ tono";
export const LOWER = "Bajar ½ tono";

/**
 * Returns the string adjustments needed to go from one key to another,
 * in the order they should be made. Returns an empty list for the same key.
 */
export function calculateTransport(from, to) {
  const fromIndex = TRANSPORT_KEYS.indexOf(from);
  const toIndex = TRANSPORT_KEYS.indexOf(to);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error(`Unsupported key: ${fromIndex === -1 ? from : to}`);
  }

  const steps = [];

  for (let i = fromIndex; i < toIndex; i++) {
    const { string, target } = STEP_UP[TRANSPORT_KEYS[i]];
    steps.push({ string, target, instruction: RAISE });
  }

  for (let i = fromIndex; i > toIndex; i--) {
    const { string, target } = STEP_UP[TRANSPORT_KEYS[i - 1]];
    steps.push({ string: target, target: string, instruction: LOWER });
  }

  return steps;
}
