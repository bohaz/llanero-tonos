import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSongs } from "@/hooks/useSongs";
import { MAJOR_KEYS, MINOR_KEYS } from "@/lib/music/keys";
import SongForm from "@/components/songs/SongForm";
import ToneTabs from "@/components/tones/ToneTabs";
import Tuner from "@/components/tuner/Tuner";
import HarpTransport from "@/components/transport/HarpTransport";
import ArpegiosLogo from "@/assets/Arpegios-logo.png";

export default function LlaneroTonosApp() {
  const { songs, editingSong, saveSong, deleteSong, startEdit, cancelEdit } =
    useSongs();

  const songActions = { songs, onEdit: startEdit, onDelete: deleteSong };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <main className="mx-auto max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center"
        >
          <img src={ArpegiosLogo} alt="" className="mb-3 h-20 w-20" />
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-white">Arpe</span>
            <span className="text-emerald-400">gios</span>
            <span className="ml-2 text-lg text-zinc-500">(beta)</span>
          </h1>
        </motion.header>

        <SongForm
          key={editingSong?.id ?? "new"}
          editingSong={editingSong}
          onSubmit={saveSong}
          onCancel={cancelEdit}
        />

        <Tabs defaultValue="mayores" className="mt-8">
          <TabsList className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <TabsTrigger value="mayores">Mayores</TabsTrigger>
            <TabsTrigger value="menores">Menores</TabsTrigger>
            <TabsTrigger value="afinador">Afinador</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
          </TabsList>

          <TabsContent value="mayores">
            <ToneTabs tones={MAJOR_KEYS} {...songActions} />
          </TabsContent>

          <TabsContent value="menores">
            <ToneTabs tones={MINOR_KEYS} {...songActions} />
          </TabsContent>

          <TabsContent value="afinador">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <Tuner />
            </div>
          </TabsContent>

          <TabsContent value="transporte">
            <HarpTransport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
