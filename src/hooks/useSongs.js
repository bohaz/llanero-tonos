import { useEffect, useState } from "react";
import { loadSongs, removeSong, saveSongs, upsertSong } from "@/lib/songs";

const storage = typeof window === "undefined" ? undefined : window.localStorage;

/** Repertoire state, persisted in localStorage. */
export function useSongs() {
  const [songs, setSongs] = useState(() => loadSongs(storage));
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    saveSongs(storage, songs);
  }, [songs]);

  const saveSong = (form) => {
    setSongs((current) =>
      upsertSong(current, form, { editingId, newId: Date.now() }),
    );
    setEditingId(null);
  };

  const deleteSong = (id) => {
    setSongs((current) => removeSong(current, id));
    if (id === editingId) setEditingId(null);
  };

  const editingSong = songs.find((s) => s.id === editingId) ?? null;

  return {
    songs,
    editingSong,
    saveSong,
    deleteSong,
    startEdit: (song) => setEditingId(song.id),
    cancelEdit: () => setEditingId(null),
  };
}
