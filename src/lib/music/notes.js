export const NOTES = [
  "DO", "DO#", "RE", "RE#", "MI",
  "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"
];

export function noteIndex(note) {
  return NOTES.indexOf(note);
}
