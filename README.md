# Arpegios

[![CI](https://github.com/bohaz/llanero-tonos/actions/workflows/ci.yml/badge.svg)](https://github.com/bohaz/llanero-tonos/actions/workflows/ci.yml)

A pocket tool for llanero harp players: keep your repertoire organized by key, tune the harp with the microphone and work out which strings to retune when changing key.

**Live demo:** [llanero-tonos.vercel.app](https://llanero-tonos.vercel.app) · The interface is in Spanish, the language of its users.

## Features

- **Repertoire by key.** Add, edit and delete songs, grouped by major and minor key. Data stays in the browser (`localStorage`); no account needed.
- **Tuner.** Detects the note being played in real time with [pitchy](https://github.com/ianprime0509/pitchy) over the Web Audio API. Readings are filtered by clarity and smoothed so the needle stays steady. The microphone is released when the tuner stops.
- **Key transposer.** A diatonic harp changes key by retuning one string per step along the circle of fifths (FA → DO → SOL → RE → LA → MI → SI). Pick the current and target key and the app lists each string to raise or lower, in order.

## Tech stack

React 19 · Vite 7 · Tailwind CSS 3 · shadcn/ui (Radix) · Framer Motion · Vitest + Testing Library · ESLint · Prettier · GitHub Actions · Vercel

## Getting started

Requires Node.js 20.19 or later (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script               | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Development server with hot reload               |
| `npm run build`      | Production build in `dist/`                      |
| `npm run preview`    | Serves the production build locally              |
| `npm test`           | Runs the test suite once                         |
| `npm run test:watch` | Runs tests in watch mode                         |
| `npm run lint`       | ESLint                                           |
| `npm run format`     | Formats the code with Prettier                   |
| `npm run check`      | Lint, format check, tests and build (same as CI) |

## Project structure

```
src/
├── lib/                # Pure logic, no React: easy to test and reuse
│   ├── music/
│   │   ├── keys.js           # Keys used to organize the repertoire
│   │   ├── transport.js      # Which strings change between two keys
│   │   ├── tuning.js         # Octave normalization, closest note, smoothing
│   │   └── chromaticNotes.js # Reference frequencies
│   └── songs.js        # Repertoire operations and persistence
├── hooks/              # React state on top of lib/
│   ├── useSongs.js
│   └── useTuner.js     # Microphone, audio context and animation loop
├── components/         # UI by feature (songs, tones, tuner, transport)
│   └── ui/             # shadcn/ui primitives
└── pages/
    └── LlaneroTonosApp.jsx
```

Business rules live in `src/lib` as plain functions. Hooks hold state and side effects (storage, microphone), and components only render. That split keeps the logic testable without a browser.

## Testing

```bash
npm test
```

- **Unit tests** cover the music logic (transposition in both directions, octave handling, note detection, smoothing) and the repertoire operations, including corrupt or unavailable storage.
- **Component tests** with Testing Library check the main flows as a user would: adding, editing and deleting songs, and calculating a transposition.

The tuner's audio capture is not unit tested, since it depends on the browser's microphone; the logic it relies on is.

CI runs lint, format check, tests and build on every pull request.

## Roadmap

- Native Android version with React Native and Expo, for Google Play.
- Tuning by cents instead of hertz, so the in-tune margin is the same in every octave.

## Author

Ricardo Martínez · [Portfolio](https://ricardomartinez.vercel.app/) · [GitHub](https://github.com/bohaz)
