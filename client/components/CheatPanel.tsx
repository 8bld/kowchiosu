import { useState, useRef, useEffect } from "react";
import { X, Minus } from "lucide-react";

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
}

export default function CheatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<Feature[]>([
    { id: "aimbot", label: "Aimbot", enabled: false },
    { id: "esp", label: "ESP", enabled: false },
    { id: "fly", label: "Fly", enabled: false },
    { id: "cframe", label: "CFrame", enabled: false },
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("[data-no-drag]")
    ) {
      return;
    }
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

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

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
      <div className="w-72 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl border border-purple-700/50 overflow-hidden">
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        >
          <h2 className="text-lg font-bold text-white tracking-wide">
            CHEAT MENU
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-purple-500/30 rounded-lg transition-colors duration-200"
              data-no-drag="true"
            >
              <Minus size={18} className="text-white" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
              data-no-drag="true"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-5 space-y-4">
            {features.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={feature.enabled}
                    onChange={() => toggleFeature(feature.id)}
                    className="w-5 h-5 opacity-0 cursor-pointer"
                  />
                  <div
                    className={`absolute inset-0 rounded-lg border-2 transition-all duration-200 ${
                      feature.enabled
                        ? "bg-gradient-to-br from-purple-400 to-purple-500 border-purple-300 shadow-lg shadow-purple-500/50"
                        : "bg-purple-800/50 border-purple-600 group-hover:border-purple-500"
                    }`}
                  >
                    {feature.enabled && (
                      <svg
                        className="absolute inset-0 w-full h-full text-white p-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-purple-100 font-medium group-hover:text-white transition-colors duration-200">
                  {feature.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Footer Status */}
        <div className="bg-purple-950/50 px-5 py-3 border-t border-purple-700/50">
          <p className="text-xs text-purple-300/70">
            Active: {features.filter((f) => f.enabled).length}/{features.length}
          </p>
        </div>
      </div>
    </div>
  );
}
