import { useState, useRef, useEffect } from "react";
import { Target, Eye, Wind, Zap, Ghost, Gauge, X, Minus, Settings } from "lucide-react";

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  sliderValue?: number;
  color?: string;
}

interface CategoryTab {
  id: string;
  name: string;
  features: Feature[];
}

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState("aimbot");
  const [guiColors, setGuiColors] = useState({
    bg: "#0f172a",
    accent: "#06b6d4",
    outline: "#334155",
    text: "#ffffff",
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryTab[]>([
    {
      id: "aimbot",
      name: "Aimbot",
      features: [
        { id: "aimbot", label: "Aimbot", enabled: false, sliderValue: 50 },
        { id: "prediction", label: "Prediction", enabled: false, sliderValue: 30 },
        { id: "sticky", label: "Sticky Aim", enabled: false, sliderValue: 75 },
      ],
    },
    {
      id: "esp",
      name: "ESP",
      features: [
        { id: "esp", label: "ESP", enabled: false, sliderValue: 100 },
        { id: "boxes", label: "Boxes Distance", enabled: false, sliderValue: 500 },
        { id: "names", label: "Names", enabled: false, sliderValue: 100 },
      ],
    },
    {
      id: "movement",
      name: "Movement",
      features: [
        { id: "fly", label: "Fly Speed", enabled: false, sliderValue: 50 },
        { id: "cframe", label: "CFrame Speed", enabled: false, sliderValue: 50 },
        { id: "noclip", label: "Noclip", enabled: false, sliderValue: 100 },
        { id: "speed", label: "Speed Boost", enabled: false, sliderValue: 50 },
      ],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

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
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleFeature = (categoryId: string, featureId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              features: cat.features.map((f) =>
                f.id === featureId ? { ...f, enabled: !f.enabled } : f
              ),
            }
          : cat
      )
    );
  };

  const updateSlider = (categoryId: string, featureId: string, value: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              features: cat.features.map((f) =>
                f.id === featureId ? { ...f, sliderValue: value } : f
              ),
            }
          : cat
      )
    );
  };

  const activeCategory = categories.find((cat) => cat.id === activeTab);
  const totalActive = categories.reduce((sum, cat) => sum + cat.features.filter((f) => f.enabled).length, 0);
  const totalFeatures = categories.reduce((sum, cat) => sum + cat.features.length, 0);

  if (!isVisible) return null;

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
      <div
        className="shadow-2xl"
        style={{
          backgroundColor: guiColors.bg,
          borderColor: guiColors.outline,
          borderWidth: "1px",
          display: "block",
        }}
      >
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          className="px-6 py-3 flex items-center justify-between border-b cursor-grab active:cursor-grabbing"
          style={{ borderColor: guiColors.outline }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2" style={{ backgroundColor: guiColors.accent }} />
            <h1 className="text-lg font-bold" style={{ color: guiColors.text }}>
              BRYAN GUI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 border" style={{ borderColor: guiColors.outline, color: guiColors.text }}>
              [{totalActive}/{totalFeatures}]
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:opacity-80 text-sm transition-opacity"
              style={{ color: guiColors.text }}
            >
              _
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:opacity-80 text-sm transition-opacity"
              style={{ color: guiColors.text }}
            >
              X
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex" style={{ height: "400px", backgroundColor: guiColors.bg }}>
            {/* 3D Model - Left */}
            <div
              className="w-1/3 p-6 flex items-center justify-center border-r"
              style={{ borderColor: guiColors.outline, height: "400px" }}
            >
              <div className="relative w-32 h-32">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: guiColors.accent,
                    boxShadow: `inset -10px -10px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${guiColors.accent}40`,
                    transform: `rotateX(20deg) rotateY(${rotation}deg) rotateZ(10deg)`,
                  }}
                />
              </div>
            </div>

            {/* Tab Navigation & Content - Right */}
            <div className="w-2/3 flex flex-col" style={{ height: "400px" }}>
              {/* Tabs */}
              <div
                className="flex border-b overflow-x-auto"
                style={{ borderColor: guiColors.outline }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === cat.id ? "border-b-2" : "border-b-transparent"
                    }`}
                    style={{
                      color: activeTab === cat.id ? guiColors.accent : "rgba(255,255,255,0.5)",
                      borderBottomColor: activeTab === cat.id ? guiColors.accent : "transparent",
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1`}
                  style={{
                    color: activeTab === "settings" ? guiColors.accent : "rgba(255,255,255,0.5)",
                    borderBottomColor: activeTab === "settings" ? guiColors.accent : "transparent",
                  }}
                >
                  <Settings size={14} /> GUI
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "settings" ? (
                  <div className="space-y-4">
                    {/* Panic Button */}
                    <button
                      onClick={() => alert("PANIC!")}
                      className="w-full py-3 font-bold text-white border-2 transition-all hover:scale-105"
                      style={{
                        backgroundColor: "#ef4444",
                        borderColor: "#dc2626",
                      }}
                    >
                      PANIC BUTTON
                    </button>

                    {/* Color Customization */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: guiColors.text }}>
                          Main Color
                        </label>
                        <input
                          type="color"
                          value={guiColors.accent}
                          onChange={(e) => setGuiColors({ ...guiColors, accent: e.target.value })}
                          className="w-full h-8 cursor-pointer border"
                          style={{ borderColor: guiColors.outline }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: guiColors.text }}>
                          Background
                        </label>
                        <input
                          type="color"
                          value={guiColors.bg}
                          onChange={(e) => setGuiColors({ ...guiColors, bg: e.target.value })}
                          className="w-full h-8 cursor-pointer border"
                          style={{ borderColor: guiColors.outline }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: guiColors.text }}>
                          Outline
                        </label>
                        <input
                          type="color"
                          value={guiColors.outline}
                          onChange={(e) => setGuiColors({ ...guiColors, outline: e.target.value })}
                          className="w-full h-8 cursor-pointer border"
                          style={{ borderColor: guiColors.outline }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: guiColors.text }}>
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={guiColors.text}
                          onChange={(e) => setGuiColors({ ...guiColors, text: e.target.value })}
                          className="w-full h-8 cursor-pointer border"
                          style={{ borderColor: guiColors.outline }}
                        />
                      </div>
                    </div>
                  </div>
                ) : activeCategory ? (
                  <div className="grid grid-cols-1 gap-3">
                    {activeCategory.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="p-3 border transition-colors"
                        style={{
                          borderColor: feature.enabled ? guiColors.accent : guiColors.outline,
                          backgroundColor: feature.enabled ? `${guiColors.accent}20` : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => toggleFeature(activeTab, feature.id)}
                            className="w-4 h-4 border transition-colors flex-shrink-0"
                            style={{
                              borderColor: guiColors.accent,
                              backgroundColor: feature.enabled ? guiColors.accent : "transparent",
                            }}
                          />
                          <span className="text-xs font-semibold flex-1" style={{ color: guiColors.text }}>
                            {feature.label}
                          </span>
                        </div>
                        {feature.enabled && (
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={feature.sliderValue || 50}
                              onChange={(e) => updateSlider(activeTab, feature.id, Number(e.target.value))}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-1 cursor-pointer"
                              style={{
                                accentColor: guiColors.accent,
                              }}
                            />
                            <div className="text-xs mt-1" style={{ color: guiColors.text }}>
                              {feature.sliderValue}%
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-2 flex items-center justify-between text-xs border-t"
          style={{ borderColor: guiColors.outline }}
        >
          <span style={{ color: guiColors.text }}>Advanced Cheats</span>
          <span style={{ color: guiColors.text }}>v2.0</span>
        </div>
      </div>
    </div>
  );
}
