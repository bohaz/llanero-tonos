import { useState, useEffect } from "react";

const STORAGE_KEY = "llanero_tonos_songs";

const DEFAULT_SONGS = [
  { id: 1, title: "Flor del Llano", artist: "Ángel Ávila", tono: "RE" },
  { id: 2, title: "Contemplando mi Casita", artist: "Ángel Ávila", tono: "RE" },
];

export function useSongs() {
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SONGS;
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }, [songs]);

  const addOrUpdateSong = (form) => {
    if (!form.title.trim()) return;

    if (editingId) {
      setSongs(songs.map((s) =>
        s.id === editingId ? { ...s, ...form } : s
      ));
      setEditingId(null);
    } else {
      setSongs([...songs, { ...form, id: Date.now() }]);
    }
  };

  const deleteSong = (id) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  const startEdit = (song) => {
    setEditingId(song.id);
    return song;
  };

  const cancelEdit = () => setEditingId(null);

  return {
    songs,
    editingId,
    addOrUpdateSong,
    deleteSong,
    startEdit,
    cancelEdit,
  };
}
