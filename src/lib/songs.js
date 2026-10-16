export const STORAGE_KEY = "llanero_tonos_songs";

export const DEFAULT_SONGS = [
  { id: 1, title: "Cruel desilusión", artist: "Nelson Morales", tono: "FA" },
  {
    id: 2,
    title: "Implorando tu perdón",
    artist: "Nelson Morales",
    tono: "FA",
  },
  { id: 3, title: "Llano adentro", artist: "Nelson Morales", tono: "DO" },
  {
    id: 4,
    title: "Brisas de mata fraile",
    artist: "Eneas Perdomo",
    tono: "DO",
  },
  { id: 5, title: "Morena Carmen Dolores", artist: "José Ali", tono: "SOL" },
  { id: 6, title: "Laguna vieja", artist: "Reynaldo Armas", tono: "SOL" },
  { id: 7, title: "Flor del llano", artist: "Angel Avila", tono: "RE" },
  { id: 8, title: "Contemplando mi casita", artist: "Angel Avila", tono: "RE" },
  { id: 9, title: "Corazón no llores más", artist: "Angel Avila", tono: "LA" },
  { id: 10, title: "El juego del amor", artist: "Reynaldo Armas", tono: "LA" },
  {
    id: 11,
    title: "Luna del capanaparo",
    artist: "José Ali Nieves",
    tono: "MI",
  },
  { id: 12, title: "A usted", artist: "Reynaldo Armas", tono: "MI" },
];

/**
 * Reads the saved repertoire. Falls back to the default songs when nothing is
 * saved, the data is corrupt or storage is not available.
 */
export function loadSongs(storage) {
  try {
    const saved = storage?.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SONGS;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : DEFAULT_SONGS;
  } catch {
    return DEFAULT_SONGS;
  }
}

export function saveSongs(storage, songs) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working
    // in memory; the change is simply not persisted.
  }
}

function normalizeForm({ title, artist, tono }) {
  return { title: title.trim(), artist: artist.trim(), tono };
}

/** Adds a new song, or updates the one with `editingId`. Ignores empty titles. */
export function upsertSong(songs, form, { editingId = null, newId } = {}) {
  const song = normalizeForm(form);
  if (!song.title) return songs;

  if (editingId !== null) {
    return songs.map((s) => (s.id === editingId ? { ...s, ...song } : s));
  }

  return [...songs, { ...song, id: newId }];
}

export function removeSong(songs, id) {
  return songs.filter((s) => s.id !== id);
}

export function songsInKey(songs, key) {
  return songs.filter((s) => s.tono === key);
}
