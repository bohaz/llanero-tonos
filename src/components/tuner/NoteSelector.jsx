import { Button } from "@/components/ui/button";

export default function NoteSelector({ notes, selected, onSelect }) {
  return (
    <div className="flex justify-center gap-2 mb-4 flex-wrap">
      {notes.map((n) => (
        <Button
          key={n.note}
          variant={selected.note === n.note ? "default" : "outline"}
          onClick={() => onSelect(n)}
          className="min-w-[48px]"
        >
          {n.note}
        </Button>
      ))}
    </div>
  );
}
