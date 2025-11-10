import { useState, useRef, useEffect } from "react";
import { Target, Eye, Wind, Zap, Ghost, Gauge, X, Minus } from "lucide-react";

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
}

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [rotation, setRotation] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<Feature[]>([
    { id: "aimbot", label: "Aimbot", enabled: false },
    { id: "prediction", label: "Prediction", enabled: false },
    { id: "sticky", label: "Sticky Aim", enabled: false },
    { id: "esp", label: "ESP", enabled: false },
    { id: "boxes", label: "Boxes", enabled: false },
    { id: "names", label: "Names", enabled: false },
    { id: "fly", label: "Fly", enabled: false },
    { id: "cframe", label: "CFrame", enabled: false },
    { id: "noclip", label: "Noclip", enabled: false },
    { id: "speed", label: "Speed", enabled: false },
    { id: "invisible", label: "Invisible", enabled: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

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

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  if (!isVisible) return null;

  const activeCount = features.filter((f) => f.enabled).length;

  return (
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "900px",
      }}
    >
      {/* Panel Container */}
      <div className="bg-slate-950 border border-slate-700 shadow-2xl">
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-700 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500" />
            <h1 className="text-lg font-bold text-white">BRYAN GUI</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 px-2 py-1 border border-slate-600 bg-slate-900/50">
              [{activeCount}/{features.length}]
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition-colors"
            >
              _
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 text-sm transition-colors"
            >
              X
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex bg-slate-950">
            {/* 3D Model - Left */}
            <div className="w-1/3 bg-slate-900 p-6 flex items-center justify-center border-r border-slate-700" style={{ height: "320px" }}>
              <div className="relative w-32 h-32">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-slate-700"
                  style={{
                    boxShadow: "inset -10px -10px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 211, 238, 0.2)",
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                  }}
                />
              </div>
            </div>

            {/* Features Grid - Right */}
            <div className="w-2/3 overflow-y-auto p-4" style={{ height: "320px" }}>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`p-3 border cursor-pointer transition-colors ${
                      feature.enabled
                        ? "bg-slate-900/80 border-cyan-600 text-cyan-300"
                        : "bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 ${
                          feature.enabled ? "bg-slate-800 text-cyan-400" : "bg-slate-800/50 text-slate-500"
                        }`}
                      >
                        {feature.id === "aimbot" && <Target size={16} />}
                        {feature.id === "prediction" && <Zap size={16} />}
                        {feature.id === "sticky" && <Gauge size={16} />}
                        {feature.id === "esp" && <Eye size={16} />}
                        {feature.id === "boxes" && <Target size={16} />}
                        {feature.id === "names" && <Eye size={16} />}
                        {feature.id === "fly" && <Wind size={16} />}
                        {feature.id === "cframe" && <Zap size={16} />}
                        {feature.id === "noclip" && <Ghost size={16} />}
                        {feature.id === "speed" && <Gauge size={16} />}
                        {feature.id === "invisible" && <Ghost size={16} />}
                      </div>
                      <span className="text-xs font-semibold flex-1">{feature.label}</span>
                      <div
                        className={`w-4 h-4 border ${
                          feature.enabled ? "bg-cyan-600 border-cyan-500" : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {feature.enabled && <div className="w-full h-full bg-white/20" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-2 border-t border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-500">Advanced Cheats</span>
          <span className="text-slate-600">v2.0</span>
        </div>
      </div>
    </div>
  );
}
