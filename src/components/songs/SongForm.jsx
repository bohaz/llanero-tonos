import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TONOS = [
  "DO", "DOm", "RE", "REm", "MI", "MIm",
  "FA", "FAm", "SOL", "SOLm", "LA", "LAm", "SI", "SIm",
];

export default function SongForm({ onSubmit, editingSong, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    tono: "DO",
  });

  useEffect(() => {
    if (editingSong) setForm(editingSong);
  }, [editingSong]);

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ title: "", artist: "", tono: "DO" });
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg">
      <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 p-5">

        <Input
          placeholder="Canción"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-emerald-500"
        />

        <Input
          placeholder="Intérprete"
          value={form.artist}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
          className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-emerald-500"
        />

        <select
          value={form.tono}
          onChange={(e) => setForm({ ...form, tono: e.target.value })}
          className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {TONOS.map((t) => (
            <option key={t} value={t} className="bg-zinc-950">
              {t}
            </option>
          ))}
        </select>

        <Button
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 text-zinc-950 font-semibold"
        >
          {editingSong ? "Guardar" : "Agregar"}
        </Button>

        {editingSong && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
