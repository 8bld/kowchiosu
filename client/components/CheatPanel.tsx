import { useState, useRef, useEffect } from "react";

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  value?: number;
  min?: number;
  max?: number;
}

interface Tab {
  id: string;
  name: string;
  features: Feature[];
}

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("relax");
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#1e40af",
    background: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    text: "#f1f5f9",
    accent: "#06b6d4",
  });

  const [toggledFeatures, setToggledFeatures] = useState<Record<string, boolean>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  
  const panelRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = [
    {
      id: "relax",
      name: "Relax",
      features: [
        { id: "auto_click", label: "Auto Click", enabled: false, value: 50, min: 1, max: 100 },
        { id: "click_assist", label: "Click Assist", enabled: false, value: 50, min: 0, max: 100 },
      ],
    },
    {
      id: "aimbot",
      name: "Aimbot",
      features: [
        { id: "aim_assist", label: "Aim Assist", enabled: false, value: 50, min: 0, max: 100 },
        { id: "smooth_aim", label: "Smooth Aim", enabled: false, value: 50, min: 0, max: 100 },
      ],
    },
    {
      id: "difficulty",
      name: "Difficulty",
      features: [
        { id: "cs_mod", label: "Circle Size", enabled: false, value: 50, min: 0, max: 100 },
        { id: "ar_mod", label: "Approach Rate", enabled: false, value: 50, min: 0, max: 100 },
      ],
    },
    {
      id: "replay",
      name: "Replay",
      features: [
        { id: "auto_replay", label: "Auto Replay", enabled: false },
        { id: "replay_speed", label: "Replay Speed", enabled: false, value: 50, min: 1, max: 200 },
        { id: "frame_skip", label: "Frame Skip", enabled: false, value: 50, min: 0, max: 100 },
        { id: "pause_anywhere", label: "Pause Anywhere", enabled: false },
      ],
    },
  ];

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

  const toggleFeature = (featureId: string) => {
    setToggledFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const updateSliderValue = (featureId: string, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [featureId]: value
    }));
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "420px",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 2px ${colors.primary}20`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-5 py-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}10 100%)`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: colors.primary,
              borderRadius: "50%",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <h1 className="text-sm font-bold tracking-wider" style={{ color: colors.text }}>
            OSU CHEAT
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:opacity-70 transition-opacity"
            style={{ color: colors.text }}
          >
            {isMinimized ? "+" : "−"}
          </button>
          <button
            className="p-1.5 hover:opacity-70 transition-opacity"
            style={{ color: colors.text }}
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div
            className="flex overflow-x-auto text-xs"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 font-semibold transition-all duration-300"
                style={{
                  color: activeTab === tab.id ? colors.primary : "rgba(241,245,249,0.5)",
                  borderBottom: activeTab === tab.id ? `2px solid ${colors.primary}` : "none",
                  backgroundColor: activeTab === tab.id ? `${colors.primary}10` : "transparent",
                }}
              >
                {tab.name}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("misc")}
              className="px-4 py-3 font-semibold ml-auto transition-all duration-300"
              style={{
                color: activeTab === "misc" ? colors.primary : "rgba(241,245,249,0.5)",
                borderBottom: activeTab === "misc" ? `2px solid ${colors.primary}` : "none",
                backgroundColor: activeTab === "misc" ? `${colors.primary}10` : "transparent",
              }}
            >
              ⚙
            </button>
          </div>

          {/* Content */}
          <div style={{ height: "400px", overflow: "hidden" }}>
            {activeTab === "misc" ? (
              <div className="p-5 h-full overflow-y-auto" style={{ backgroundColor: colors.background }}>
                <style>
                  {`
                    @keyframes pulse {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.5; }
                    }
                    @keyframes float {
                      0%, 100% { transform: translateY(0px); }
                      50% { transform: translateY(-4px); }
                    }
                  `}
                </style>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Panic Button */}
                  <button
                    onClick={() => alert("PANIC ACTIVATED - All features disabled")}
                    className="w-full py-4 font-bold transition-all duration-300 hover:opacity-90 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      color: colors.text,
                      border: `2px solid #7f1d1d`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      letterSpacing: "1px",
                      transform: "translateZ(0)",
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
                    }}
                  >
                    ⚠ PANIC
                  </button>

                  {/* Color Grid */}
                  <div>
                    <h3 style={{ color: colors.text, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "14px", opacity: 0.8 }}>
                      Theme System
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {[
                        { key: "primary", label: "Primary", emoji: "⚡" },
                        { key: "background", label: "Background", emoji: "🌑" },
                        { key: "surface", label: "Surface", emoji: "📦" },
                        { key: "text", label: "Text", emoji: "✍️" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="transition-all duration-300 hover:scale-105"
                          style={{
                            padding: "12px",
                            backgroundColor: `${colors[item.key as keyof typeof colors]}25`,
                            border: `1.5px solid ${colors[item.key as keyof typeof colors]}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            position: "relative",
                          }}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "color";
                            input.value = colors[item.key as keyof typeof colors];
                            input.onchange = (e: any) => {
                              setColors({ ...colors, [item.key]: e.target.value });
                            };
                            input.click();
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                            <span style={{ fontSize: "16px" }}>{item.emoji}</span>
                            <div>
                              <div style={{ fontSize: "11px", fontWeight: "700", color: colors.text }}>
                                {item.label}
                              </div>
                              <div
                                style={{
                                  fontSize: "9px",
                                  fontFamily: "monospace",
                                  color: "rgba(241,245,249,0.6)",
                                  marginTop: "2px",
                                }}
                              >
                                {colors[item.key as keyof typeof colors]}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              width: "24px",
                              height: "24px",
                              backgroundColor: colors[item.key as keyof typeof colors],
                              borderRadius: "8px 0 8px 0",
                              border: `1px solid ${colors.border}`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div>
                    <h3 style={{ color: colors.text, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "12px", opacity: 0.8 }}>
                      Customization
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        { label: "UI Opacity", id: "ui_opacity", min: 20, max: 100, default: 100 },
                        { label: "Animation Speed", id: "anim_speed", min: 50, max: 200, default: 100 },
                      ].map((setting) => (
                        <div key={setting.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(241,245,249,0.8)" }}>
                              {setting.label}
                            </label>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: colors.primary }}>
                              {sliderValues[setting.id] ?? setting.default}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            value={sliderValues[setting.id] ?? setting.default}
                            onChange={(e) => updateSliderValue(setting.id, parseInt(e.target.value))}
                            style={{
                              width: "100%",
                              height: "5px",
                              borderRadius: "3px",
                              backgroundColor: colors.border,
                              outline: "none",
                              WebkitAppearance: "none" as any,
                              appearance: "none",
                              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${((sliderValues[setting.id] ?? setting.default) - setting.min) / (setting.max - setting.min) * 100}%, ${colors.border} ${((sliderValues[setting.id] ?? setting.default) - setting.min) / (setting.max - setting.min) * 100}%, ${colors.border} 100%)`,
                              cursor: "pointer",
                            } as any}
                          />
                          <style>{`
                            input[type="range"]::-webkit-slider-thumb {
                              -webkit-appearance: none;
                              appearance: none;
                              width: 14px;
                              height: 14px;
                              border-radius: 50%;
                              background: ${colors.primary};
                              cursor: pointer;
                              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                              transition: all 0.2s ease;
                            }
                            input[type="range"]::-webkit-slider-thumb:hover {
                              transform: scale(1.1);
                              box-shadow: 0 2px 8px ${colors.primary}60;
                            }
                            input[type="range"]::-moz-range-thumb {
                              width: 14px;
                              height: 14px;
                              border-radius: 50%;
                              background: ${colors.primary};
                              cursor: pointer;
                              border: none;
                              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                              transition: all 0.2s ease;
                            }
                            input[type="range"]::-moz-range-thumb:hover {
                              transform: scale(1.1);
                              box-shadow: 0 2px 8px ${colors.primary}60;
                            }
                          `}</style>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTabData ? (
              <div className="p-5 h-full overflow-y-auto" style={{ backgroundColor: colors.background }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {activeTabData.features.map((feature) => {
                    const isEnabled = toggledFeatures[feature.id] || false;
                    const sliderValue = sliderValues[feature.id] ?? (feature.value || 0);

                    return (
                      <div
                        key={feature.id}
                        className="transition-all duration-300"
                        style={{
                          padding: "12px 14px",
                          backgroundColor: isEnabled ? `${colors.primary}15` : colors.surface,
                          border: `1px solid ${isEnabled ? colors.primary : colors.border}`,
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className="transition-all duration-300"
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "4px",
                              border: `2px solid ${colors.primary}`,
                              backgroundColor: isEnabled ? colors.primary : "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isEnabled && (
                              <span style={{ color: colors.background, fontSize: "12px", fontWeight: "bold" }}>✓</span>
                            )}
                          </button>
                          <label
                            className="transition-colors duration-300 cursor-pointer"
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: isEnabled ? colors.primary : colors.text,
                            }}
                          >
                            {feature.label}
                          </label>
                        </div>

                        {feature.value !== undefined && (
                          <div>
                            <input
                              type="range"
                              min={feature.min || 0}
                              max={feature.max || 100}
                              value={sliderValue}
                              onChange={(e) => updateSliderValue(feature.id, parseInt(e.target.value))}
                              style={{
                                width: "100%",
                                height: "5px",
                                borderRadius: "3px",
                                backgroundColor: `${colors.border}`,
                                outline: "none",
                                WebkitAppearance: "none" as any,
                                appearance: "none",
                                background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${sliderValue}%, ${colors.border} ${sliderValue}%, ${colors.border} 100%)`,
                                cursor: "pointer",
                              } as any}
                            />
                            <style>{`
                              input[type="range"]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                background: ${colors.primary};
                                cursor: pointer;
                                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                                transition: all 0.2s ease;
                              }
                              input[type="range"]::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                                box-shadow: 0 2px 8px ${colors.primary}60;
                              }
                              input[type="range"]::-moz-range-thumb {
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                background: ${colors.primary};
                                cursor: pointer;
                                border: none;
                                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                                transition: all 0.2s ease;
                              }
                              input[type="range"]::-moz-range-thumb:hover {
                                transform: scale(1.1);
                                box-shadow: 0 2px 8px ${colors.primary}60;
                              }
                            `}</style>
                            <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "11px", color: "rgba(241,245,249,0.5)" }}>
                                {feature.min || 0}
                              </span>
                              <span style={{ fontSize: "12px", fontWeight: "600", color: colors.primary }}>
                                {sliderValue}
                              </span>
                              <span style={{ fontSize: "11px", color: "rgba(241,245,249,0.5)" }}>
                                {feature.max || 100}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Footer */}
      <div
        className="px-5 py-3 flex justify-between text-xs"
        style={{
          borderTop: `1px solid ${colors.border}`,
          background: `linear-gradient(135deg, ${colors.primary}10 0%, transparent 100%)`,
          color: "rgba(241,245,249,0.5)",
        }}
      >
        <span>OSU CHEAT v1.0</span>
        <span>AI ENHANCED</span>
      </div>
    </div>
  );
}
