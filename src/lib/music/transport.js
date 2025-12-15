const TRANSPORT_STEPS = {
  "DO>FA":  { string: "SI",  target: "LA#", instruction: "Bajar ½ tono" },
  "FA>DO":  { string: "La#",  target: "SI",  instruction: "Subir ½ tono" },

  "DO>SOL": { string: "FA",  target: "FA#", instruction: "Subir ½ tono" },
  "SOL>DO": { string: "FA#",  target: "FA",  instruction: "Bajar ½ tono" },

  "SOL>RE": { string: "DO",  target: "DO#", instruction: "Subir ½ tono" },
  "RE>SOL": { string: "DO#",  target: "DO",  instruction: "Bajar ½ tono" },

  "RE>LA":  { string: "SOL", target: "SOL#", instruction: "Subir ½ tono" },
  "LA>RE":  { string: "SOL#", target: "SOL",  instruction: "Bajar ½ tono" },

  "LA>MI":  { string: "RE",  target: "RE#", instruction: "Subir ½ tono" },
  "MI>LA":  { string: "RE#",  target: "RE",  instruction: "Bajar ½ tono" },

  "MI>SI":  { string: "LA",  target: "LA#", instruction: "Subir ½ tono" },
  "SI>MI":  { string: "LA#",  target: "LA",  instruction: "Bajar ½ tono" },
};

const TRANSPORT_ORDER = ["FA", "DO", "SOL", "RE", "LA", "MI", "SI"];

function nextIndex(i) {
  return (i + 1) % TRANSPORT_ORDER.length;
}

function prevIndex(i) {
  return (i - 1 + TRANSPORT_ORDER.length) % TRANSPORT_ORDER.length;
}

export function calculateTransport(from, to) {
  if (from === to) return [];

  const result = [];
  let current = from;

  const fromIndex = TRANSPORT_ORDER.indexOf(from);
  const toIndex = TRANSPORT_ORDER.indexOf(to);

  const forward =
    (toIndex - fromIndex + TRANSPORT_ORDER.length) %
    TRANSPORT_ORDER.length;

  const backward =
    (fromIndex - toIndex + TRANSPORT_ORDER.length) %
    TRANSPORT_ORDER.length;

  const direction = forward <= backward ? "forward" : "backward";
  const steps = direction === "forward" ? forward : backward;

  for (let i = 0; i < steps; i++) {
    const idx = TRANSPORT_ORDER.indexOf(current);
    const next =
      direction === "forward"
        ? TRANSPORT_ORDER[nextIndex(idx)]
        : TRANSPORT_ORDER[prevIndex(idx)];

    const rule = TRANSPORT_STEPS[`${current}>${next}`];

    if (!rule) {
      result.push({
        string: "—",
        target: "—",
        instruction: "Paso no definido",
      });
      current = next;
      continue;
    }

    result.push(rule);
    current = next;
  }

  return result;
}
