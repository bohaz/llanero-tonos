import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NATURAL_KEYS = ["FA", "DO", "SOL", "RE", "LA", "MI", "SI"];

export default function TransportSelector({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onCalculate,
}) {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="p-6 text-white space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Transporte de Arpa Llanera
        </h2>

        <div className="text-sm text-neutral-400 text-center">
          Escala de transporte <br />
          <span className="text-white font-semibold">
            FA → DO → SOL → RE → LA → MI → SI
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-400">Tono actual</label>
            <select
              value={from}
              onChange={(e) => onChangeFrom(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 mt-1"
            >
              {NATURAL_KEYS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-neutral-400">Transportar a</label>
            <select
              value={to}
              onChange={(e) => onChangeTo(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 mt-1"
            >
              {NATURAL_KEYS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        <Button className="w-full" onClick={onCalculate}>
          Calcular transporte
        </Button>
      </CardContent>
    </Card>
  );
}
