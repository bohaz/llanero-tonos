import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTuner } from "@/hooks/useTuner";
import { tuningStatus } from "@/lib/music/tuning";
import TunerNeedle from "./TunerNeedle";

const STATUS_LABEL = {
  idle: { text: "Toca una cuerda", className: "text-neutral-400" },
  "in-tune": { text: "✔ Afinado", className: "text-green-400 font-semibold" },
  sharp: { text: "Agudo ↑", className: "text-red-400" },
  flat: { text: "Grave ↓", className: "text-blue-400" },
};

export default function Tuner() {
  const { running, error, note, frequency, diff, start, stop } = useTuner();
  const status = STATUS_LABEL[tuningStatus(diff)];

  return (
    <Card className="mx-auto max-w-md border-neutral-800 bg-neutral-900">
      <CardContent className="p-6 text-center text-white">
        <div className="mb-1 text-6xl font-bold" aria-live="polite">
          {note}
        </div>

        <div className="mb-2 text-sm text-neutral-400">
          {frequency ? `${frequency.toFixed(1)} Hz` : "Escuchando..."}
        </div>

        <TunerNeedle diff={diff} />

        <div className={`mb-4 text-lg ${status.className}`}>{status.text}</div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {running ? (
          <Button variant="outline" onClick={stop} className="w-full">
            Detener
          </Button>
        ) : (
          <Button onClick={start} className="w-full">
            Iniciar afinador
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
