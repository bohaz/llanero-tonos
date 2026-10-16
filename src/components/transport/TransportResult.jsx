import { Card, CardContent } from "@/components/ui/card";

export default function TransportResult({ steps }) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="p-6 text-white">
        <h3 className="mb-4 text-xl font-bold">🔧 Ajustes de cuerdas</h3>

        {steps.length === 0 ? (
          <p className="text-neutral-400">
            Ya estás en ese tono: no hay que mover ninguna cuerda.
          </p>
        ) : (
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li
                key={`${index}-${step.string}`}
                className="flex items-center justify-between rounded bg-neutral-800 px-4 py-3"
              >
                <div>
                  <p className="text-lg font-semibold">Cuerda {step.string}</p>
                  <p className="text-sm text-neutral-400">→ {step.target}</p>
                </div>
                <span className="font-semibold text-yellow-400">
                  {step.instruction}
                </span>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-4 text-sm text-neutral-400">
          💡 Consejo: afina una cuerda a la vez y vuelve a revisar las
          anteriores.
        </p>
      </CardContent>
    </Card>
  );
}
