import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransportResult({ result }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="p-6 text-white">
        <h3 className="text-xl font-bold mb-4">
          🔧 Ajustes de cuerdas
        </h3>

        <div className="space-y-3">
          {result.map((r) => (
            <div
              key={r.string}
              className="flex items-center justify-between bg-neutral-800 rounded px-4 py-3"
            >
              <div>
                <p className="font-semibold text-lg">
                  Cuerda {r.string}
                </p>
                <p className="text-sm text-neutral-400">
                  → {r.target}
                </p>
              </div>

              <div
                className={`font-semibold ${
                  r.instruction === "No se mueve"
                    ? "text-neutral-400"
                    : r.instruction.includes("½")
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {r.instruction}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-neutral-400 mt-4">
          💡 Consejo: afina una cuerda a la vez y vuelve a revisar
          las anteriores.
        </p>
      </CardContent>
    </Card>
  );
}
