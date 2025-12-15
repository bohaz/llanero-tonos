import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import { normalizeFrequency, findClosestNote } from "@/lib/music/tuning";

const CLARITY_THRESHOLD = 0.85;
const SMOOTHING_SIZE = 8;
const UPDATE_INTERVAL = 120;

export function useTuner() {
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("--");
  const [frequency, setFrequency] = useState(null);
  const [diff, setDiff] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const detectorRef = useRef(null);
  const bufferRef = useRef(null);
  const rafRef = useRef(null);

  const historyRef = useRef([]);
  const lastUpdateRef = useRef(0);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    const audioContext = new AudioContext();
    await audioContext.resume();

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    bufferRef.current = buffer;
    detectorRef.current = detector;

    historyRef.current = [];
    lastUpdateRef.current = 0;

    setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  };

  const loop = (now) => {
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    const detector = detectorRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !buffer || !detector || !audioContext) return;

    analyser.getFloatTimeDomainData(buffer);

    const [freq, clarity] = detector.findPitch(
      buffer,
      audioContext.sampleRate
    );

    if (now - lastUpdateRef.current > UPDATE_INTERVAL) {
      lastUpdateRef.current = now;

      if (clarity > CLARITY_THRESHOLD && freq > 50 && freq < 1200) {
        const normalized = normalizeFrequency(freq);

        historyRef.current.push(normalized);
        if (historyRef.current.length > SMOOTHING_SIZE) {
          historyRef.current.shift();
        }

        const avg =
          historyRef.current.reduce((a, b) => a + b, 0) /
          historyRef.current.length;

        const result = findClosestNote(avg);

        setFrequency(avg.toFixed(1));
        setNote(result.note);
        setDiff(result.diff);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioContextRef.current?.close();

    historyRef.current = [];
    setRunning(false);
    setNote("--");
    setFrequency(null);
    setDiff(null);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return {
    running,
    note,
    frequency,
    diff,
    start,
    stop,
  };
}
