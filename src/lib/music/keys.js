/** Keys used to organize the repertoire. A trailing "m" marks a minor key. */
export const KEYS = [
  "DO",
  "DOm",
  "RE",
  "REm",
  "MI",
  "MIm",
  "FA",
  "FAm",
  "SOL",
  "SOLm",
  "LA",
  "LAm",
  "SI",
  "SIm",
];

export const isMinorKey = (key) => key.endsWith("m");

export const MAJOR_KEYS = KEYS.filter((key) => !isMinorKey(key));
export const MINOR_KEYS = KEYS.filter(isMinorKey);

export const DEFAULT_KEY = "DO";
