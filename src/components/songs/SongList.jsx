import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SongList({ songs, onEdit, onDelete }) {
  if (songs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        No hay canciones en este tono.
      </p>
    );
  }

  return (
    <div className="grid gap-3 mt-4">
      {songs.map((song) => (
        <Card key={song.id} className="flex justify-between items-center p-3">
          <div>
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onEdit(song)}>
              Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(song.id)}>
              Borrar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
