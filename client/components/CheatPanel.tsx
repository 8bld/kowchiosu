import { useState, useRef, useEffect } from "react";
import {
  Target,
  Eye,
  Wind,
  Zap,
  Ghost,
  Gauge,
  X,
  Minus,
  Sliders,
} from "lucide-react";

interface Feature {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  value?: number;
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
    { id: "aimbot", label: "Aimbot", icon: <Target size={20} />, enabled: false, value: 50 },
    { id: "prediction", label: "Prediction", icon: <Zap size={20} />, enabled: false, value: 50 },
    { id: "sticky", label: "Sticky Aim", icon: <Gauge size={20} />, enabled: false, value: 50 },
    { id: "esp", label: "ESP", icon: <Eye size={20} />, enabled: false, value: 75 },
    { id: "boxes", label: "Boxes", icon: <Target size={20} />, enabled: false, value: 100 },
    { id: "names", label: "Names", icon: <Eye size={20} />, enabled: false, value: 100 },
    { id: "fly", label: "Fly", icon: <Wind size={20} />, enabled: false, value: 50 },
    { id: "cframe", label: "CFrame", icon: <Zap size={20} />, enabled: false, value: 50 },
    { id: "noclip", label: "Noclip", icon: <Ghost size={20} />, enabled: false, value: 100 },
    { id: "speed", label: "Speed", icon: <Gauge size={20} />, enabled: false, value: 50 },
    { id: "invisible", label: "Invisible", icon: <Ghost size={20} />, enabled: false, value: 100 },
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) return;
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

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Auto-rotate the 3D model
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const updateValue = (id: string, value: number) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  const activeCount = features.filter((f) => f.enabled).length;

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <div className="w-screen max-w-4xl shadow-2xl overflow-hidden bg-slate-950 border border-slate-700">
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          className="relative bg-slate-900 px-6 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-slate-700"
        >

          <div className="relative flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse shadow-lg shadow-cyan-500/50" />
              <h1 className="text-2xl font-black text-white tracking-wider">
                BRYAN<span className="text-cyan-400"> GUI</span>
              </h1>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-cyan-300">
              [{activeCount}/{features.length}]
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-200 text-white/70 hover:text-red-400"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex h-screen max-h-96">
            {/* 3D Character Spinner */}
            <div className="w-1/3 bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-black/50 p-6 flex items-center justify-center border-r border-white/5 relative overflow-hidden group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 3D Model Representation with CSS */}
              <div className="relative w-32 h-32">
                {/* Outer sphere */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 animate-pulse"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(34, 211, 238, 0.3), inset -20px -20px 40px rgba(0, 0, 0, 0.3)",
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                    transition: "transform 0.03s linear",
                  }}
                />

                {/* Inner detail */}
                <div
                  className="absolute inset-4 rounded-full bg-gradient-to-t from-transparent to-white/10"
                  style={{
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                    transition: "transform 0.03s linear",
                  }}
                />

                {/* Center highlight */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-white/20 blur-xl" />
              </div>
            </div>

            {/* Features Grid */}
            <div className="w-2/3 overflow-y-auto bg-slate-900/30 p-6">
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`group p-4 rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                      feature.enabled
                        ? "bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                        : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/70"
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`p-2.5 rounded-lg transition-all duration-300 ${
                          feature.enabled
                            ? "bg-cyan-500/40 text-cyan-200"
                            : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-bold text-sm ${
                            feature.enabled
                              ? "text-cyan-300"
                              : "text-slate-300 group-hover:text-slate-200"
                          }`}
                        >
                          {feature.label}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                          feature.enabled
                            ? "bg-cyan-500/60 border-cyan-400 shadow-lg shadow-cyan-500/30"
                            : "border-slate-600 group-hover:border-slate-500"
                        }`}
                      >
                        {feature.enabled && (
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    {feature.enabled && (
                      <div className="pl-10 pr-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={feature.value || 50}
                          onChange={(e) =>
                            updateValue(feature.id, Number(e.target.value))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-1 rounded-full bg-slate-700 appearance-none cursor-pointer accent-cyan-500"
                          style={{
                            accentColor: "#06b6d4",
                          }}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {feature.value}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900/80 to-black/80 px-8 py-3 border-t border-white/5 flex items-center justify-between text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Sliders size={14} className="text-cyan-400" />
            <span>Advanced Cheats Control Panel</span>
          </div>
          <div className="text-slate-500">v2.0 Premium</div>
        </div>
      </div>
    </div>
  );
}
