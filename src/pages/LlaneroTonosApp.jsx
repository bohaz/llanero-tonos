import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSongs } from "@/hooks/useSongs";
import SongForm from "@/components/songs/SongForm";
import ToneTabs from "@/components/tones/ToneTabs";
import Tuner from "@/components/Tuner";
import HarpTransport from "@/components/transport/HarpTransport";

const TONOS = [
  "DO", "DOm", "RE", "REm", "MI", "MIm", "FA", "FAm",
  "SOL", "SOLm", "LA", "LAm", "SI", "SIm",
];

const MAYORES = TONOS.filter((t) => !t.endsWith("m"));
const MENORES = TONOS.filter((t) => t.endsWith("m"));

export default function LlaneroTonosApp() {
  const {
    songs,
    editingId,
    addOrUpdateSong,
    deleteSong,
    startEdit,
    cancelEdit,
  } = useSongs();

  const editingSong = editingId
    ? songs.find((s) => s.id === editingId)
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 tracking-tight"
        >
          🎵 <span className="text-emerald-400">Afin</span>Arpa
          <span className="text-zinc-500 text-lg ml-2">(beta)</span>
        </motion.h1>

        {/* Formulario */}
        <SongForm
          onSubmit={addOrUpdateSong}
          editingSong={editingSong}
          onCancel={cancelEdit}
        />

        {/* Tabs principales */}
        <Tabs defaultValue="mayores" className="mt-8">
          <TabsList className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-6">
            <TabsTrigger value="mayores">Mayores</TabsTrigger>
            <TabsTrigger value="menores">Menores</TabsTrigger>
            <TabsTrigger value="afinador">Afinador</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
          </TabsList>

          <TabsContent value="mayores">
            <ToneTabs
              tones={MAYORES}
              songs={songs}
              onEdit={startEdit}
              onDelete={deleteSong}
              defaultTone="DO"
            />
          </TabsContent>

          <TabsContent value="menores">
            <ToneTabs
              tones={MENORES}
              songs={songs}
              onEdit={startEdit}
              onDelete={deleteSong}
              defaultTone="DOm"
            />
          </TabsContent>

          <TabsContent value="afinador">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <Tuner />
            </div>
          </TabsContent>
          <TabsContent value="transporte">
            <HarpTransport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
