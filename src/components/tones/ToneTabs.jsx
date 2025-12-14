import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SongList from "../songs/SongList";

export default function ToneTabs({
  tones,
  songs,
  onEdit,
  onDelete,
  defaultTone,
}) {
  return (
    <Tabs defaultValue={defaultTone}>
      <TabsList className="flex flex-wrap">
        {tones.map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>

      {tones.map((t) => (
        <TabsContent key={t} value={t}>
          <SongList
            songs={songs.filter((s) => s.tono === t)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
