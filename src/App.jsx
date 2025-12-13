import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Tuner from "@/components/Tuner";


const TONOS = [
  "DO", "DOm",
  "RE", "REm",
  "MI", "MIm",
  "FA", "FAm",
  "SOL", "SOLm",
  "LA", "LAm",
  "SI", "SIm",
];

const STORAGE_KEY = "llanero_tonos_songs";

const MAYORES = TONOS.filter((t) => !t.endsWith("m"));
const MENORES = TONOS.filter((t) => t.endsWith("m"));

export default function LlaneroTonosApp() {
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "Flor del Llano", artist: "Ángel Ávila", tono: "RE" },
          { id: 2, title: "Contemplando mi Casita", artist: "Ángel Ávila", tono: "RE" },
        ];
  });

  const [form, setForm] = useState({
    title: "",
    artist: "",
    tono: "DO",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }, [songs]);

  const addOrUpdateSong = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      setSongs(
        songs.map((s) =>
          s.id === editingId ? { ...s, ...form } : s
        )
      );
      setEditingId(null);
    } else {
      setSongs([...songs, { ...form, id: Date.now() }]);
    }

    setForm({ title: "", artist: "", tono: "DO" });
  };

  const editSong = (song) => {
    setEditingId(song.id);
    setForm({
      title: song.title,
      artist: song.artist,
      tono: song.tono,
    });
  };

  const deleteSong = (id) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", artist: "", tono: "DO" });
  };

  const renderSongsByTone = (tono) => {
    const list = songs.filter((s) => s.tono === tono);

    if (list.length === 0) {
      return (
        <p className="text-sm text-muted-foreground mt-4">
          No hay canciones en este tono.
        </p>
      );
    }

    return (
      <div className="grid gap-3 mt-4">
        {list.map((song) => (
          <Card
            key={song.id}
            className="flex justify-between items-center p-3"
          >
            <div>
              <p className="font-semibold">{song.title}</p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => editSong(song)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteSong(song.id)}
              >
                Borrar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        🎵 LlaneroTonos (beta)
      </motion.h1>

      {/* Formulario */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4">
          <Input
            placeholder="Canción"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <Input
            placeholder="Intérprete"
            value={form.artist}
            onChange={(e) =>
              setForm({ ...form, artist: e.target.value })
            }
          />
          <select
            className="border rounded px-2"
            value={form.tono}
            onChange={(e) =>
              setForm({ ...form, tono: e.target.value })
            }
          >
            {TONOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <Button onClick={addOrUpdateSong}>
            {editingId ? "Guardar" : "Agregar"}
          </Button>

          {editingId && (
            <Button variant="outline" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs defaultValue="mayores">
        <TabsList className="mb-4">
          <TabsTrigger value="mayores">Mayores</TabsTrigger>
          <TabsTrigger value="menores">Menores</TabsTrigger>
          <TabsTrigger value="afinador">Afinador</TabsTrigger>

        </TabsList>

        {/* Mayores */}
        <TabsContent value="mayores">
          <Tabs defaultValue="DO">
            <TabsList className="flex flex-wrap">
              {MAYORES.map((tono) => (
                <TabsTrigger key={tono} value={tono}>
                  {tono}
                </TabsTrigger>
              ))}
            </TabsList>

            {MAYORES.map((tono) => (
              <TabsContent key={tono} value={tono}>
                {renderSongsByTone(tono)}
              </TabsContent>
            ))}
          </Tabs>

           
        </TabsContent>

        {/* Menores */}
        <TabsContent value="menores">
          <Tabs defaultValue="DOm">
            <TabsList className="flex flex-wrap">
              {MENORES.map((tono) => (
                <TabsTrigger key={tono} value={tono}>
                  {tono}
                </TabsTrigger>
              ))}
            </TabsList>

            {MENORES.map((tono) => (
              <TabsContent key={tono} value={tono}>
                {renderSongsByTone(tono)}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="afinador">
          <Tuner />
        </TabsContent>
      </Tabs>
    </div>
  );
}
