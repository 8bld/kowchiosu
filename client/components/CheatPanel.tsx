import { useState, useRef, useEffect } from "react";
import { X, Minus } from "lucide-react";

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
      className={`w-16 h-10 rounded-full transition-all duration-300 flex items-center cursor-grab active:cursor-grabbing ${
        enabled ? "bg-purple-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-8 h-8 bg-white rounded-full shadow-lg transition-transform duration-300 ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </div>
  );
}

export default function CheatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<Feature[]>([
    { id: "aimbot", label: "Aimbot", enabled: false },
    { id: "esp", label: "ESP", enabled: false },
    { id: "fly", label: "Fly", enabled: false },
    { id: "cframe", label: "CFrame", enabled: false },
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
        cursor: isPanelDragging ? "grabbing" : "grab",
      }}
    >
      <div className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div
          onMouseDown={handlePanelMouseDown}
          className="bg-purple-600 px-8 py-5 flex items-center justify-between cursor-grab active:cursor-grabbing"
        >
          <h2 className="text-2xl font-bold text-white">CHEAT MENU</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-purple-500 rounded-lg transition-colors duration-200"
              data-no-drag="true"
            >
              <Minus size={22} className="text-white" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-red-500 rounded-lg transition-colors duration-200"
              data-no-drag="true"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-8 space-y-6 bg-gray-50">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {feature.label}
                </span>
                <div data-no-drag="true">
                  <ToggleSwitch
                    enabled={feature.enabled}
                    onChange={() => toggleFeature(feature.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Status */}
        <div className="bg-gray-100 px-8 py-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-600">
            Active Features: {features.filter((f) => f.enabled).length}/
            {features.length}
          </p>
        </div>
      </div>
    </div>
  );
}
