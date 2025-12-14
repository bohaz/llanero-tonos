import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PitchDetector } from "pitchy";

/* =========================
   NOTAS BASE (octava media)
   ========================= */
const NOTES = [
  { note: "DO", freq: 261.63 },
  { note: "RE", freq: 293.66 },
  { note: "MI", freq: 329.63 },
  { note: "FA", freq: 349.23 },
  { note: "SOL", freq: 392.0 },
  { note: "LA", freq: 440.0 },
  { note: "SI", freq: 493.88 },
];

/* =========================
   NORMALIZAR OCTAVAS
   ========================= */
function normalizeFrequency(freq) {
  if (!freq) return freq;
  while (freq > 520) freq /= 2;
  while (freq < 130) freq *= 2;
  return freq;
}

/* =========================
   COMPONENTE AGUJA
   ========================= */
function TunerNeedle({ diff }) {
  const value =
    diff !== null ? Math.max(-50, Math.min(50, diff * 10)) : 0;

  const inTune = diff !== null && Math.abs(diff) < 1;

  return (
    <div className="w-full max-w-xs mx-auto mt-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>♭ Grave</span>
        <span>✔</span>
        <span>♯ Agudo</span>
      </div>

      <div className="relative h-2 bg-neutral-700 rounded-full overflow-hidden">
        {/* centro */}
        <div className="absolute left-1/2 top-0 h-2 w-[2px] bg-neutral-300" />

        {/* aguja */}
        <div
          className={`absolute -top-3 h-6 w-[3px] rounded transition-all duration-150 ${
            inTune ? "bg-green-500" : "bg-red-500"
          }`}
          style={{
            left: `calc(50% + ${value}%)`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <p className="text-sm mt-3 text-center">
        {diff === null
          ? "Escuchando…"
          : inTune
          ? "Afinado ✔"
          : diff > 0
          ? "Muy agudo"
          : "Muy grave"}
      </p>
    </div>
  );
}

/* =========================
   TUNER
   ========================= */
export default function Tuner() {
  const [isRunning, setIsRunning] = useState(false);
  const [note, setNote] = useState("--");
  const [frequency, setFrequency] = useState(null);
  const [diff, setDiff] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const bufferRef = useRef(null);

  /* =========================
     INICIAR
     ========================= */
  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      bufferRef.current = new Float32Array(analyserRef.current.fftSize);
      detectorRef.current = PitchDetector.forFloat32Array(
        analyserRef.current.fftSize
      );

      setIsRunning(true);
      detectPitch();
    } catch (err) {
      alert("No se pudo acceder al micrófono");
      console.error(err);
    }
  };

  /* =========================
     DETECCIÓN
     ========================= */
  const detectPitch = () => {
    analyserRef.current.getFloatTimeDomainData(bufferRef.current);

    let [freq, clarity] = detectorRef.current.findPitch(
      bufferRef.current,
      audioContextRef.current.sampleRate
    );

    if (clarity > 0.75 && freq > 50 && freq < 1200) {
      freq = normalizeFrequency(freq);
      setFrequency(freq.toFixed(1));

      let closest = NOTES[0];
      let minDiff = Math.abs(freq - closest.freq);

      for (const n of NOTES) {
        const d = Math.abs(freq - n.freq);
        if (d < minDiff) {
          minDiff = d;
          closest = n;
        }
      }

      setNote(closest.note);
      setDiff(freq - closest.freq);
    } else {
      setNote("--");
      setFrequency(null);
      setDiff(null);
    }

    rafRef.current = requestAnimationFrame(detectPitch);
  };

  /* =========================
     DETENER
     ========================= */
  const stopTuner = () => {
    cancelAnimationFrame(rafRef.current);
    audioContextRef.current?.close();

    setIsRunning(false);
    setNote("--");
    setFrequency(null);
    setDiff(null);
  };

  useEffect(() => () => stopTuner(), []);

  /* =========================
     UI
     ========================= */
  return (
    <Card className="max-w-md mx-auto mt-6 bg-neutral-900 border border-neutral-800">
      <CardContent className="p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2">
          🎧 Afinador
        </h2>

        <div className="text-6xl font-bold mb-2">{note}</div>

        <div className="text-sm text-muted-foreground mb-4">
          {frequency ? `${frequency} Hz` : "--"}
        </div>

        <TunerNeedle diff={diff} />

        <div className="mt-6">
          {!isRunning ? (
            <Button
              onClick={startTuner}
              className="bg-green-600 hover:bg-green-700"
            >
              Iniciar afinador
            </Button>
          ) : (
            <Button variant="outline" onClick={stopTuner}>
              Detener
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
