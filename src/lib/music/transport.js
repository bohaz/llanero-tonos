const TRANSPORT_RULES = {
  "DO>SOL": { string: "FA", target: "FA#", instruction: "Subir ½ tono" },
  "SOL>RE": { string: "DO", target: "DO#", instruction: "Subir ½ tono" },
  "RE>LA": { string: "SOL", target: "SOL#", instruction: "Subir ½ tono" },
  "LA>MI": { string: "RE", target: "RE#", instruction: "Subir ½ tono" },
  "MI>SI": { string: "LA", target: "LA#", instruction: "Subir ½ tono" },

  "DO>FA": { string: "SI", target: "LA#", instruction: "Bajar ½ tono" },
};

export function calculateTransport(from, to) {
  if (from === to) return [];

  const key = `${from}>${to}`;
  const rule = TRANSPORT_RULES[key];

  if (!rule) {
    return [
      {
        string: "—",
        target: "—",
        instruction: "Transporte no directo",
      },
    ];
  }

  return [
    {
      string: rule.string,
      target: rule.target,
      instruction: rule.instruction,
    },
  ];
}
