import { useState, useRef, useEffect } from "react";
import { X, Minus, ChevronDown, Maximize2 } from "lucide-react";

interface FeatureToggle {
  id: string;
  label: string;
  enabled: boolean;
}

interface SubFeature {
  id: string;
  label: string;
  type: "toggle" | "slider" | "color";
  value?: number | string;
  min?: number;
  max?: number;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const toggleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dragDistance = e.clientX - dragStart;
      if (Math.abs(dragDistance) > 20) {
        onChange();
        setIsDragging(false);
      }
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
  }, [isDragging, dragStart, onChange]);

  return (
    <div
      ref={toggleRef}
      onClick={onChange}
      onMouseDown={handleMouseDown}
      className={`w-10 h-5 transition-all duration-200 flex items-center cursor-grab active:cursor-grabbing border-2 ${
        enabled ? "bg-green-700 border-green-500" : "bg-gray-700 border-gray-600"
      }`}
    >
      <div
        className={`w-3 h-3 transition-transform duration-200 ${
          enabled ? "translate-x-4 bg-green-300" : "translate-x-0.5 bg-gray-400"
        }`}
      />
    </div>
  );
}

function Slider({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1" data-no-drag="true">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 appearance-none cursor-pointer accent-green-500"
        style={{
          accentColor: "#10b981",
        }}
      />
      <div className="text-xs font-mono text-gray-400 text-right">{value}</div>
    </div>
  );
}

export default function CheatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<FeatureCategory[]>([
    {
      name: "Aimbot",
      features: [
        { id: "aimbot", label: "Aimbot", enabled: false },
        { id: "prediction", label: "Prediction", enabled: false },
        { id: "sticky", label: "Sticky Aim", enabled: false },
      ],
    },
    {
      name: "ESP",
      features: [
        { id: "esp", label: "ESP", enabled: false },
        { id: "boxes", label: "Boxes", enabled: false },
        { id: "names", label: "Names", enabled: false },
        { id: "distance", label: "Distance", enabled: false },
      ],
    },
    {
      name: "Exploits",
      features: [
        { id: "fly", label: "Fly", enabled: false },
        { id: "cframe", label: "CFrame", enabled: false },
        { id: "noclip", label: "Noclip", enabled: false },
        { id: "speed", label: "Speed Boost", enabled: false },
        { id: "invisible", label: "Invisible", enabled: false },
      ],
    },
  ]);

  const handlePanelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("[data-no-drag]")
    ) {
      return;
    }
    setIsPanelDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isPanelDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanelDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanelDragging, dragOffset]);

  const toggleFeature = (featureId: string) => {
    setCategories(
      categories.map((cat) => ({
        ...cat,
        features: cat.features.map((f) =>
          f.id === featureId ? { ...f, enabled: !f.enabled } : f
        ),
      }))
    );
  };

  if (!isVisible) return null;

  const activeCount = categories.reduce(
    (sum, cat) => sum + cat.features.filter((f) => f.enabled).length,
    0
  );
  const totalCount = categories.reduce((sum, cat) => sum + cat.features.length, 0);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isPanelDragging ? "grabbing" : "grab",
      }}
    >
      <div className="w-96 bg-gray-900 border-2 border-gray-700 shadow-lg overflow-hidden" style={{ fontFamily: "system-ui, monospace" }}>
        {/* Simple Header */}
        <div
          onMouseDown={handlePanelMouseDown}
          className="bg-gray-800 px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-gray-700"
        >
          <h2 className="text-xs font-bold text-blue-300 tracking-wider">BRYAN GUI</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold border border-gray-600 hover:border-gray-500 transition-colors"
              data-no-drag="true"
            >
              _
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold border border-gray-600 hover:border-gray-500 transition-colors"
              data-no-drag="true"
            >
              X
            </button>
          </div>
        </div>
        {/* Category Tabs */}
        {!isMinimized && (
          <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(index)}
                className={`flex-1 px-3 py-2 text-xs font-bold transition-colors border-b-2 ${
                  activeCategory === index
                    ? "text-blue-300 border-b-blue-400 bg-gray-700/50"
                    : "text-gray-400 border-b-transparent hover:text-gray-300"
                }`}
                data-no-drag="true"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {!isMinimized && (
          <div className="max-h-80 overflow-y-auto bg-gray-900">
            {categories[activeCategory] && (
              <div className="divide-y divide-gray-700">
                {categories[activeCategory].features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-2 border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-mono ${
                          feature.enabled
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.label}
                      </span>
                      <div data-no-drag="true">
                        <ToggleSwitch
                          enabled={feature.enabled}
                          onChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Status */}
        <div className="bg-gray-800 px-3 py-1 border-t border-gray-700">
          <p className="text-xs font-mono text-blue-300">
            [{activeCount}/{totalCount}] Active
          </p>
        </div>
      </div>
    </div>
  );
}
