import { useState, useRef, useEffect } from "react";

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-slate-950 border border-slate-700 shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "900px",
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-700 cursor-grab active:cursor-grabbing"
      >
        <h1 className="text-lg font-bold text-white">BRYAN GUI</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-white text-sm hover:bg-slate-800">_</button>
          <button className="px-3 py-1 text-white text-sm hover:bg-slate-800">X</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex bg-slate-950" style={{ height: "400px" }}>
        {/* Left Panel */}
        <div className="w-1/3 bg-slate-900 border-r border-slate-700 p-6 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg shadow-lg" />
        </div>

        {/* Right Panel */}
        <div className="w-2/3 p-6 bg-slate-950 overflow-y-auto">
          <div className="space-y-3">
            <div className="p-3 border border-slate-700 text-white">Aimbot</div>
            <div className="p-3 border border-slate-700 text-white">Prediction</div>
            <div className="p-3 border border-slate-700 text-white">Sticky Aim</div>
            <div className="p-3 border border-slate-700 text-white">ESP</div>
            <div className="p-3 border border-slate-700 text-white">Boxes</div>
            <div className="p-3 border border-slate-700 text-white">Names</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 px-6 py-2 border-t border-slate-700 flex justify-between text-xs text-slate-400">
        <span>Advanced Cheats</span>
        <span>v2.0</span>
      </div>
    </div>
  );
}
