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
      className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center cursor-grab active:cursor-grabbing ${
        enabled ? "bg-purple-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
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
      {/* macOS-style Header */}
      <div
        onMouseDown={handlePanelMouseDown}
        className="bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing rounded-t-xl"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors duration-200 flex-shrink-0"
            data-no-drag="true"
          />
          <button
            onClick={() => {
              // Fullscreen toggle
            }}
            className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300 transition-colors duration-200 flex-shrink-0"
            data-no-drag="true"
          />
          <button
            onClick={() => setIsVisible(false)}
            className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300 transition-colors duration-200 flex-shrink-0"
            data-no-drag="true"
          />
        </div>
        <h2 className="text-sm font-bold text-white flex-1 text-center">Bryan GUI</h2>
        <div className="w-12" />
      </div>

      <div className="w-80 bg-white rounded-b-xl shadow-xl border border-t-0 border-gray-200 overflow-hidden">
        {/* Content */}
        {!isMinimized && (
          <div className="max-h-96 overflow-y-auto bg-gray-50">
            <div className="divide-y divide-gray-200">
              {features.map((feature) => (
                <div key={feature.id} className="p-3">
                  {/* Main Toggle Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      {feature.subFeatures && feature.subFeatures.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(feature.id)}
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          data-no-drag="true"
                        >
                          <ChevronDown
                            size={16}
                            className={`text-gray-600 transition-transform ${
                              feature.expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                      {!feature.subFeatures ||
                        (feature.subFeatures.length === 0 && (
                          <div className="w-5" />
                        ))}
                      <span
                        className={`text-sm font-semibold ${
                          feature.enabled
                            ? "text-purple-600"
                            : "text-gray-700"
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
                      <div className="mt-3 ml-6 space-y-3 border-l-2 border-purple-200 pl-3">
                        {feature.subFeatures.map((sub) => (
                          <div key={sub.id}>
                            {sub.type === "toggle" && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">
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
                                <div className="text-xs font-medium text-gray-600 mb-1">
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
                                <div className="text-xs font-medium text-gray-600 mb-2">
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
                                    className="w-8 h-8 rounded cursor-pointer"
                                  />
                                  <span className="text-xs text-gray-500 flex items-center">
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
        <div className="bg-gray-100 px-5 py-2 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-600">
            Active: {activeCount}/{features.length}
          </p>
        </div>
      </div>
    </div>
  );
}
