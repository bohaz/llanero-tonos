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
     INICIAR AFINADOR
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

    // 🔑 ESTA LÍNEA ES CRÍTICA
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
     DETECTAR TONO
     ========================= */
  const detectPitch = () => {
    if (!analyserRef.current) return;

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
     DETENER AFINADOR
     ========================= */
  const stopTuner = () => {
    cancelAnimationFrame(rafRef.current);
    audioContextRef.current?.close();

    setIsRunning(false);
    setNote("--");
    setFrequency(null);
    setDiff(null);
  };

  /* =========================
     LIMPIEZA
     ========================= */
  useEffect(() => {
    return () => stopTuner();
  }, []);

  /* =========================
     UI
     ========================= */
  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardContent className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">🎧 Afinador</h2>

        <div className="text-5xl font-bold mb-2">{note}</div>

        <div className="text-gray-600 mb-2">
          {frequency ? `${frequency} Hz` : "--"}
        </div>

        <div className="text-lg mb-4">
          {note === "--" ? (
            <span className="text-gray-500">Escuchando...</span>
          ) : Math.abs(diff) < 1 ? (
            <span className="text-green-600">Afinado ✔</span>
          ) : diff > 0 ? (
            <span className="text-red-600">Muy agudo ↑</span>
          ) : (
            <span className="text-blue-600">Muy grave ↓</span>
          )}
        </div>

        {!isRunning ? (
          <Button onClick={startTuner}>Iniciar afinador</Button>
        ) : (
          <Button variant="outline" onClick={stopTuner}>
            Detener
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
