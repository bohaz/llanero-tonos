import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTuner } from "@/hooks/useTuner";
import TunerNeedle from "./tuner/TunerNeedle";

export default function Tuner() {
  const { running, note, frequency, diff, start, stop } = useTuner();

  return (
    <Card className="max-w-md mx-auto bg-neutral-900 border-neutral-800">
      <CardContent className="p-6 text-center text-white">
        

        <div className="text-6xl font-bold mb-1">{note}</div>

        <div className="text-sm text-neutral-400 mb-2">
          {frequency ? `${frequency} Hz` : "Escuchando..."}
        </div>

        <TunerNeedle diff={diff} />

        <div className="mb-4 text-lg">
          {diff === null ? (
            <span className="text-neutral-400">Toca una cuerda</span>
          ) : Math.abs(diff) < 1 ? (
            <span className="text-green-400 font-semibold">
              ✔ Afinado
            </span>
          ) : diff > 0 ? (
            <span className="text-red-400">Agudo ↑</span>
          ) : (
            <span className="text-blue-400">Grave ↓</span>
          )}
        </div>

        {!running ? (
          <Button onClick={start} className="w-full">
            Iniciar afinador
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={stop}
            className="w-full"
          >
            Detener
          </Button>
        )}
      </CardContent>
    </Card>
  );
}