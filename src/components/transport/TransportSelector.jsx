import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TRANSPORT_KEYS } from "@/lib/music/transport";

function KeySelect({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-neutral-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 p-2"
      >
        {TRANSPORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TransportSelector({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onCalculate,
}) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="space-y-4 p-6 text-white">
        <h2 className="text-center text-2xl font-bold">Escala de transporte</h2>

        <p className="text-center text-sm font-semibold">
          {TRANSPORT_KEYS.join(" → ")}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <KeySelect
            id="transport-from"
            label="Tono actual"
            value={from}
            onChange={onChangeFrom}
          />
          <KeySelect
            id="transport-to"
            label="Transportar a"
            value={to}
            onChange={onChangeTo}
          />
        </div>

        <Button className="w-full" onClick={onCalculate}>
          Calcular transporte
        </Button>
      </CardContent>
    </Card>
  );
}
