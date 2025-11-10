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

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500" />
            <h1 className="text-lg font-bold text-white">
              BRYAN GUI
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 px-2 py-1 border border-slate-600 bg-slate-900/50">
              [{activeCount}/{features.length}]
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white text-sm"
            >
              _
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-slate-800 transition-colors text-slate-400 hover:text-red-400 text-sm"
            >
              X
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex h-screen max-h-96">
            {/* 3D Character Spinner */}
            <div className="w-1/3 bg-slate-900 p-6 flex items-center justify-center border-r border-slate-700 relative overflow-hidden">
              {/* 3D Model Representation with CSS */}
              <div className="relative w-32 h-32">
                {/* Outer sphere */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-slate-700"
                  style={{
                    boxShadow:
                      "inset -10px -10px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 211, 238, 0.2)",
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                    transition: "transform 0.03s linear",
                  }}
                />

                {/* Inner detail */}
                <div
                  className="absolute inset-4 bg-gradient-to-t from-transparent to-white/5"
                  style={{
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                    transition: "transform 0.03s linear",
                  }}
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="w-2/3 overflow-y-auto bg-slate-950 p-4">
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`group p-3 transition-colors duration-200 cursor-pointer border ${
                      feature.enabled
                        ? "bg-slate-900/80 border-cyan-600 text-cyan-300"
                        : "bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-900/60 hover:border-slate-600"
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div
                        className={`p-1.5 transition-colors duration-200 ${
                          feature.enabled
                            ? "bg-slate-800 text-cyan-400"
                            : "bg-slate-800/50 text-slate-500"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-xs">
                          {feature.label}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 border transition-colors duration-200 flex items-center justify-center flex-shrink-0 ${
                          feature.enabled
                            ? "bg-cyan-600 border-cyan-500"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {feature.enabled && (
                          <div className="w-1.5 h-1.5 bg-white" />
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    {feature.enabled && (
                      <div className="pl-9 pr-1 text-xs">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={feature.value || 50}
                          onChange={(e) =>
                            updateValue(feature.id, Number(e.target.value))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-0.5 bg-slate-700 appearance-none cursor-pointer"
                          style={{
                            accentColor: "#06b6d4",
                          }}
                        />
                        <p className="text-slate-500 mt-0.5">
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
