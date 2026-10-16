import { needleRotation } from "@/lib/music/tuning";

export default function TunerNeedle({ diff }) {
  return (
    <div className="relative mb-4 h-24" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 h-16 w-1 origin-bottom bg-white"
        style={{
          transform: `translateX(-50%) rotate(${needleRotation(diff)}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-neutral-500">
        <span>Grave</span>
        <span>Afinado</span>
        <span>Agudo</span>
      </div>
    </div>
  );
}
