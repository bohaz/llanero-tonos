export default function TunerNeedle({ diff }) {
  const rotation = diff
    ? Math.max(-45, Math.min(45, diff * 3))
    : 0;

  return (
    <div className="relative h-24 mb-4">
      <div
        className="absolute left-1/2 top-1/2 w-1 h-16 bg-white origin-bottom"
        style={{
          transform: `translateX(-50%) rotate(${rotation}deg)`,
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
