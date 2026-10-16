import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { songsInKey } from "@/lib/songs";
import SongList from "@/components/songs/SongList";

/** One tab per key, each listing the songs in that key. */
export default function ToneTabs({ tones, songs, onEdit, onDelete }) {
  return (
    <Tabs defaultValue={tones[0]}>
      <TabsList className="flex flex-wrap">
        {tones.map((tone) => (
          <TabsTrigger key={tone} value={tone}>
            {tone}
          </TabsTrigger>
        ))}
      </TabsList>

      {tones.map((tone) => (
        <TabsContent key={tone} value={tone}>
          <SongList
            songs={songsInKey(songs, tone)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
