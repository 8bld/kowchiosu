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

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  expanded?: boolean;
  subFeatures?: SubFeature[];
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
    <div className="space-y-2" data-no-drag="true">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <div className="text-xs text-gray-600 text-right">{value}</div>
    </div>
  );
}

export default function CheatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "aimbot",
      label: "Aimbot",
      enabled: false,
      expanded: false,
      subFeatures: [
        { id: "prediction", label: "Prediction", type: "toggle" },
        { id: "sticky", label: "Sticky Aim", type: "toggle" },
        { id: "fov", label: "FOV", type: "slider", value: 50, min: 10, max: 180 },
      ],
    },
    {
      id: "esp",
      label: "ESP",
      enabled: false,
      expanded: false,
      subFeatures: [
        { id: "boxes", label: "Boxes", type: "toggle" },
        { id: "names", label: "Names", type: "toggle" },
        { id: "distance", label: "Distance", type: "toggle" },
        {
          id: "espcolor",
          label: "ESP Color",
          type: "color",
          value: "#ff00ff",
        },
      ],
    },
    {
      id: "fly",
      label: "Fly",
      enabled: false,
      expanded: false,
      subFeatures: [
        {
          id: "flyspeed",
          label: "Fly Speed",
          type: "slider",
          value: 50,
          min: 1,
          max: 100,
        },
      ],
    },
    {
      id: "cframe",
      label: "CFrame",
      enabled: false,
      expanded: false,
      subFeatures: [
        {
          id: "cframespeed",
          label: "CFrame Speed",
          type: "slider",
          value: 50,
          min: 1,
          max: 100,
        },
      ],
    },
    {
      id: "noclip",
      label: "Noclip",
      enabled: false,
      expanded: false,
    },
    {
      id: "speed",
      label: "Speed Boost",
      enabled: false,
      expanded: false,
      subFeatures: [
        {
          id: "speedvalue",
          label: "Speed",
          type: "slider",
          value: 50,
          min: 1,
          max: 100,
        },
      ],
    },
    {
      id: "invisible",
      label: "Invisible",
      enabled: false,
      expanded: false,
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

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const toggleExpanded = (id: string) => {
    setFeatures(
      features.map((f) =>
        f.id === id ? { ...f, expanded: !f.expanded } : f
      )
    );
  };

  const updateSubFeature = (
    featureId: string,
    subFeatureId: string,
    newValue: any
  ) => {
    setFeatures(
      features.map((f) =>
        f.id === featureId
          ? {
              ...f,
              subFeatures: f.subFeatures?.map((sf) =>
                sf.id === subFeatureId ? { ...sf, value: newValue } : sf
              ),
            }
          : f
      )
    );
  };

  if (!isVisible) return null;

  const activeCount = features.filter((f) => f.enabled).length;

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
      <div className="w-72 bg-gray-900 border-2 border-gray-700 shadow-lg overflow-hidden" style={{ fontFamily: "system-ui, monospace" }}>
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
        {/* Content */}
        {!isMinimized && (
          <div className="max-h-96 overflow-y-auto bg-gray-900">
            <div className="divide-y divide-gray-700">
              {features.map((feature) => (
                <div key={feature.id} className="p-2 border-b border-gray-700">
                  {/* Main Toggle Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 flex items-center gap-1">
                      {feature.subFeatures && feature.subFeatures.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(feature.id)}
                          className="p-0 hover:text-blue-300 transition-colors"
                          data-no-drag="true"
                        >
                          <ChevronDown
                            size={14}
                            className={`text-gray-400 transition-transform ${
                              feature.expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                      {!feature.subFeatures ||
                        (feature.subFeatures.length === 0 && (
                          <div className="w-4" />
                        ))}
                      <span
                        className={`text-xs font-mono ${
                          feature.enabled
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </div>
                    <div data-no-drag="true">
                      <ToggleSwitch
                        enabled={feature.enabled}
                        onChange={() => toggleFeature(feature.id)}
                      />
                    </div>
                  </div>

                  {/* Sub Features */}
                  {feature.expanded &&
                    feature.subFeatures &&
                    feature.subFeatures.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2 border-l border-gray-700 pl-2">
                        {feature.subFeatures.map((sub) => (
                          <div key={sub.id}>
                            {sub.type === "toggle" && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-gray-300">
                                  {sub.label}
                                </span>
                                <div data-no-drag="true">
                                  <ToggleSwitch
                                    enabled={
                                      typeof sub.value === "boolean"
                                        ? sub.value
                                        : false
                                    }
                                    onChange={() =>
                                      updateSubFeature(
                                        feature.id,
                                        sub.id,
                                        !sub.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {sub.type === "slider" && (
                              <div>
                                <div className="text-xs font-mono text-gray-300 mb-1">
                                  {sub.label}
                                </div>
                                <Slider
                                  value={
                                    typeof sub.value === "number"
                                      ? sub.value
                                      : 50
                                  }
                                  min={sub.min || 0}
                                  max={sub.max || 100}
                                  onChange={(val) =>
                                    updateSubFeature(feature.id, sub.id, val)
                                  }
                                />
                              </div>
                            )}
                            {sub.type === "color" && (
                              <div>
                                <div className="text-xs font-mono text-gray-300 mb-2">
                                  {sub.label}
                                </div>
                                <div className="flex gap-2" data-no-drag="true">
                                  <input
                                    type="color"
                                    value={
                                      typeof sub.value === "string"
                                        ? sub.value
                                        : "#ff00ff"
                                    }
                                    onChange={(e) =>
                                      updateSubFeature(
                                        feature.id,
                                        sub.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-6 h-6 border border-gray-600 cursor-pointer"
                                  />
                                  <span className="text-xs font-mono text-gray-400 flex items-center">
                                    {typeof sub.value === "string"
                                      ? sub.value
                                      : "#ff00ff"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Status */}
        <div className="bg-gray-800 px-3 py-1 border-t border-gray-700">
          <p className="text-xs font-mono text-blue-300">
            [{activeCount}/{features.length}] Active
          </p>
        </div>
      </div>
    </div>
  );
}
