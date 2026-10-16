import { useCallback, useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import {
  TUNER_SETTINGS,
  average,
  findClosestNote,
  isUsableReading,
  normalizeFrequency,
  pushReading,
} from "@/lib/music/tuning";

const FFT_SIZE = 2048;

const INITIAL_READING = { note: "--", frequency: null, diff: null };

/**
 * Listens to the microphone and reports the closest note.
 * The microphone is released when the tuner stops or the component unmounts.
 */
export function useTuner() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [reading, setReading] = useState(INITIAL_READING);

  // Audio objects live in a ref: they change every frame and must not re-render.
  const audio = useRef(null);

  const stop = useCallback(() => {
    const current = audio.current;
    audio.current = null;

    if (current) {
      cancelAnimationFrame(current.frame);
      current.stream.getTracks().forEach((track) => track.stop());
      current.context.close();
    }

    setRunning(false);
    setReading(INITIAL_READING);
  }, []);

  const start = useCallback(async () => {
    if (audio.current) return;
    setError(null);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
    } catch {
      setError(
        "No se pudo acceder al micrófono. Revisa los permisos del navegador.",
      );
      return;
    }

    const context = new AudioContext();
    await context.resume();

    const analyser = context.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    context.createMediaStreamSource(stream).connect(analyser);

    const state = {
      stream,
      context,
      analyser,
      buffer: new Float32Array(FFT_SIZE),
      detector: PitchDetector.forFloat32Array(FFT_SIZE),
      history: [],
      lastUpdate: 0,
      frame: null,
    };

    const tick = (now) => {
      if (audio.current !== state) return;

      state.analyser.getFloatTimeDomainData(state.buffer);
      const [freq, clarity] = state.detector.findPitch(
        state.buffer,
        state.context.sampleRate,
      );

      const dueForUpdate =
        now - state.lastUpdate > TUNER_SETTINGS.updateInterval;

      if (dueForUpdate && isUsableReading(freq, clarity)) {
        state.lastUpdate = now;
        state.history = pushReading(state.history, normalizeFrequency(freq));

        const smoothed = average(state.history);
        const { note, diff } = findClosestNote(smoothed);
        setReading({ note, frequency: smoothed, diff });
      }

      state.frame = requestAnimationFrame(tick);
    };

    audio.current = state;
    setRunning(true);
    state.frame = requestAnimationFrame(tick);
  }, []);

  useEffect(() => stop, [stop]);

  return { running, error, ...reading, start, stop };
}
