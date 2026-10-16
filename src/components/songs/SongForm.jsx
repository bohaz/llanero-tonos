import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_KEY, KEYS } from "@/lib/music/keys";

const EMPTY_FORM = { title: "", artist: "", tono: DEFAULT_KEY };

/**
 * Adds a song or edits `editingSong`. The parent remounts it (via `key`) when
 * the song being edited changes, so the initial state is always correct.
 */
export default function SongForm({ editingSong, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    editingSong
      ? {
          title: editingSong.title,
          artist: editingSong.artist,
          tono: editingSong.tono,
        }
      : EMPTY_FORM,
  );

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    onSubmit(form);
    setForm(EMPTY_FORM);
  };

  return (
    <Card className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 md:grid-cols-5"
          aria-label={editingSong ? "Editar canción" : "Agregar canción"}
        >
          <label className="sr-only" htmlFor="song-title">
            Canción
          </label>
          <Input
            id="song-title"
            placeholder="Canción"
            value={form.title}
            onChange={update("title")}
            required
            className="border-zinc-800 bg-zinc-950 text-zinc-100 focus:ring-emerald-500"
          />

          <label className="sr-only" htmlFor="song-artist">
            Intérprete
          </label>
          <Input
            id="song-artist"
            placeholder="Intérprete"
            value={form.artist}
            onChange={update("artist")}
            className="border-zinc-800 bg-zinc-950 text-zinc-100 focus:ring-emerald-500"
          />

          <label className="sr-only" htmlFor="song-key">
            Tono
          </label>
          <select
            id="song-key"
            value={form.tono}
            onChange={update("tono")}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {KEYS.map((key) => (
              <option key={key} value={key} className="bg-zinc-950">
                {key}
              </option>
            ))}
          </select>

          <Button
            type="submit"
            className="bg-emerald-600 font-semibold text-zinc-950 hover:bg-emerald-700"
          >
            {editingSong ? "Guardar" : "Agregar"}
          </Button>

          {editingSong && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
