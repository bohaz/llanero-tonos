import { useState, useEffect } from "react";

const STORAGE_KEY = "llanero_tonos_songs";

const DEFAULT_SONGS = [
  // FA
  { id: 1, title: "Cruel desilusión", artist: "Nelson Morales", tono: "FA" },
  { id: 2, title: "Implorando tu perdón", artist: "Nelson Morales", tono: "FA" },

  // DO
  { id: 3, title: "Llano adentro", artist: "Nelson Morales", tono: "DO" },
  { id: 4, title: "Brisas de mata fraile", artist: "Eneas Perdomo", tono: "DO" },

  // SOL
  { id: 5, title: "Morena Carmen Dolores", artist: "José Ali", tono: "SOL" },
  { id: 6, title: "Laguna vieja", artist: "Reynaldo Armas", tono: "SOL" },

  // RE
  { id: 7, title: "Flor del llano", artist: "Angel Avila", tono: "RE" },
  { id: 8, title: "Contemplando mi casita", artist: "Angel Avila", tono: "RE" },

  // LA
  { id: 9, title: "Corazón no llores más", artist: "Angel Avila", tono: "LA" },
  { id: 10, title: "El juego del amor", artist: "Reynaldo Armas", tono: "LA" },

  // MI
  { id: 11, title: "Luna del capanaparo", artist: "José Ali Nieves", tono: "MI" },
  { id: 12, title: "A usted", artist: "Reynaldo Armas", tono: "MI" },
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
