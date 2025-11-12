import { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface FreedomConfig {
  ar_lock: boolean;
  ar_value: number;
  cs_lock: boolean;
  cs_value: number;
  od_lock: boolean;
  od_value: number;
  visible: boolean;
  font_size: number;
  relax: boolean;
  relax_style: string;
  aimbot: boolean;
  spins_per_minute: number;
  fraction_modifier: number;
  replay: boolean;
  replay_aim: boolean;
  replay_keys: boolean;
  replay_hardrock: boolean;
  sm_lock: boolean;
  sm_value: number;
  drpc: boolean;
  drpc_state: string;
  drpc_large: string;
  drpc_small: string;
  fl: boolean;
  hd: boolean;
  tw_lock: boolean;
  tw_value: number;
  jump_window: boolean;
  show_debug: boolean;
}

const AnimeGirlLogo = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="7" r="4.5" fill={color} opacity="0.9" />
    <path d="M 5.5 7 Q 5 4 10 3 Q 15 4 14.5 7" fill={color} />
    <ellipse cx="8" cy="6.5" rx="1.2" ry="1.5" fill="#000" />
    <circle cx="8.3" cy="6" r="0.4" fill="#fff" />
    <ellipse cx="12" cy="6.5" rx="1.2" ry="1.5" fill="#000" />
    <circle cx="12.3" cy="6" r="0.4" fill="#fff" />
    <path d="M 9.5 8.5 Q 10 9 10.5 8.5" stroke={color} strokeWidth="0.5" fill="none" />
    <rect x="7.5" y="11.5" width="5" height="5" fill={color} opacity="0.7" rx="1" />
    <line x1="7.5" y1="12" x2="5" y2="14" stroke={color} strokeWidth="1" />
    <line x1="12.5" y1="12" x2="15" y2="14" stroke={color} strokeWidth="1" />
  </svg>
);

const DEFAULT_COLORS = {
  primary: "#ec4899",
  secondary: "#be185d",
  background: "#0f172a",
  surface: "#1e293b",
  border: "#334155",
  text: "#f1f5f9",
  accent: "#ec4899",
};

const API_URL = "http://localhost:3000/api/config";

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("difficulty");
  const [isMinimized, setIsMinimized] = useState(false);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [config, setConfig] = useState<FreedomConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch config from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const updateConfig = useCallback(async (key: string, value: any) => {
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Failed to update config:", error);
    }
  }, []);

  const tabs = useMemo(
    () => [
      {
        id: "difficulty",
        name: "Difficulty",
        features: [
          { id: "cs_lock", label: "Circle Size (CS)", type: "toggle" },
          { id: "cs_value", label: "CS Value", type: "slider", min: 0, max: 10, step: 0.1 },
          { id: "ar_lock", label: "Approach Rate (AR)", type: "toggle" },
          { id: "ar_value", label: "AR Value", type: "slider", min: 0, max: 10, step: 0.1 },
          { id: "od_lock", label: "Overall Difficulty (OD)", type: "toggle" },
          { id: "od_value", label: "OD Value", type: "slider", min: 0, max: 10, step: 0.1 },
        ],
      },
      {
        id: "relax",
        name: "Relax",
        features: [
          { id: "relax", label: "Relax Mode", type: "toggle" },
          { id: "relax_style", label: "Relax Style", type: "text" },
        ],
      },
      {
        id: "aimbot",
        name: "Aimbot",
        features: [
          { id: "aimbot", label: "Aimbot", type: "toggle" },
          { id: "spins_per_minute", label: "Spins Per Minute", type: "slider", min: 50, max: 500, step: 1 },
        ],
      },
      {
        id: "timewarp",
        name: "Timewarp",
        features: [
          { id: "tw_lock", label: "Timewarp", type: "toggle" },
          { id: "tw_value", label: "Playback Rate", type: "slider", min: 50, max: 300, step: 1 },
        ],
      },
      {
        id: "replay",
        name: "Replay",
        features: [
          { id: "replay", label: "Replay", type: "toggle" },
          { id: "replay_aim", label: "Replay Aim Only", type: "toggle" },
          { id: "replay_keys", label: "Replay Keys Only", type: "toggle" },
          { id: "replay_hardrock", label: "Hard Rock", type: "toggle" },
        ],
      },
      {
        id: "mods",
        name: "Mods",
        features: [
          { id: "fl", label: "Flashlight", type: "toggle" },
          { id: "hd", label: "Hidden Remover", type: "toggle" },
          { id: "sm_lock", label: "Score Multiplier", type: "toggle" },
          { id: "sm_value", label: "Multiplier Value", type: "slider", min: 0.1, max: 5, step: 0.1 },
        ],
      },
    ],
    []
  );

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

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        tabs.scrollLeft += e.deltaY;
      }
    };
    tabs.addEventListener("wheel", handleWheel, { passive: false });
    return () => tabs.removeEventListener("wheel", handleWheel);
  }, []);

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const resetTheme = () => setColors(DEFAULT_COLORS);

  if (loading) {
    return (
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "420px",
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "20px",
          color: colors.text,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!config) {
    return (
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "420px",
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "20px",
          color: colors.text,
        }}
      >
        Failed to load config
      </div>
    );
  }

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
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .kowchi-tabs::-webkit-scrollbar,
        .kowchi-content::-webkit-scrollbar {
          display: none;
        }
        .kowchi-tabs,
        .kowchi-content {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="range"] {
          width: 100%;
          height: 5px;
          border-radius: 3px;
          background: linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} var(--value), ${colors.border} var(--value), ${colors.border} 100%);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${colors.primary};
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${colors.primary};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>

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
          <AnimeGirlLogo color={colors.primary} />
          <h1 className="text-sm font-bold tracking-wider" style={{ color: colors.text }}>
            KOWCHI
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
          <button className="p-1.5 hover:opacity-70 transition-opacity" style={{ color: colors.text }}>
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div
            ref={tabsRef}
            className="kowchi-tabs flex overflow-x-auto text-xs"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 font-semibold transition-all duration-300 whitespace-nowrap"
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
              onClick={() => setActiveTab("settings")}
              className="px-4 py-3 font-semibold ml-auto transition-all duration-300"
              style={{
                color: activeTab === "settings" ? colors.primary : "rgba(241,245,249,0.5)",
                borderBottom: activeTab === "settings" ? `2px solid ${colors.primary}` : "none",
                backgroundColor: activeTab === "settings" ? `${colors.primary}10` : "transparent",
              }}
            >
              ⚙
            </button>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="kowchi-content"
            style={{ height: "400px", overflow: "auto" }}
          >
            {activeTab === "settings" ? (
              <div className="p-5 h-full" style={{ backgroundColor: colors.background }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <button
                    onClick={() => {
                      fetch(`${API_URL}/reset`, { method: "POST" }).then(() => location.reload());
                    }}
                    className="w-full transition-all duration-300 hover:opacity-90"
                    style={{
                      padding: "10px 16px",
                      background: `linear-gradient(135deg, ${colors.primary}80 0%, ${colors.secondary}80 100%)`,
                      color: colors.text,
                      border: `1.5px solid ${colors.primary}`,
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ↻ Reset Config
                  </button>
                  <button
                    onClick={resetTheme}
                    className="w-full transition-all duration-300 hover:opacity-90"
                    style={{
                      padding: "10px 16px",
                      background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
                      color: colors.text,
                      border: `1.5px solid #991b1b`,
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ↻ Reset Theme
                  </button>
                  <div>
                    <h3 style={{ color: colors.text, fontSize: "11px", fontWeight: "700", marginBottom: "14px" }}>
                      THEME SYSTEM
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {[
                        { key: "primary", label: "Primary", emoji: "⚡" },
                        { key: "background", label: "Background", emoji: "🌑" },
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
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{item.emoji}</span>
                            <div>
                              <div style={{ fontSize: "11px", fontWeight: "700", color: colors.text }}>
                                {item.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTabData ? (
              <div className="p-5 h-full" style={{ backgroundColor: colors.background }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {activeTabData.features.map((feature: any) => {
                    const value = (config as any)[feature.id];
                    const isToggle = feature.type === "toggle";

                    return (
                      <div
                        key={feature.id}
                        className="transition-all duration-300"
                        style={{
                          padding: "12px 14px",
                          backgroundColor: isToggle && value ? `${colors.primary}15` : colors.surface,
                          border: `1px solid ${isToggle && value ? colors.primary : colors.border}`,
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: feature.type === "slider" ? "8px" : "0",
                          }}
                        >
                          {isToggle && (
                            <button
                              onClick={() => updateConfig(feature.id, !value)}
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "4px",
                                border: `2px solid ${colors.primary}`,
                                backgroundColor: value ? colors.primary : "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {value && <span style={{ color: colors.background, fontSize: "12px" }}>✓</span>}
                            </button>
                          )}
                          <label style={{ fontSize: "13px", fontWeight: "600", color: colors.text }}>
                            {feature.label}
                          </label>
                          {feature.type === "slider" && (
                            <span style={{ fontSize: "11px", color: colors.primary, marginLeft: "auto" }}>
                              {typeof value === "number" ? value.toFixed(1) : value}
                            </span>
                          )}
                        </div>

                        {feature.type === "slider" && (
                          <input
                            type="range"
                            min={feature.min}
                            max={feature.max}
                            step={feature.step || 1}
                            value={value || 0}
                            onChange={(e) => {
                              const numValue =
                                feature.step && feature.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value);
                              updateConfig(feature.id, numValue);
                            }}
                            style={{
                              "--value": `${((value - feature.min) / (feature.max - feature.min)) * 100}%`,
                            } as any}
                          />
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
        style={{
          borderTop: `1px solid ${colors.border}`,
          background: `linear-gradient(135deg, ${colors.primary}10 0%, transparent 100%)`,
          color: "rgba(241,245,249,0.5)",
          padding: "12px 20px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>KOWCHI v1.0 (FREEDOM)</span>
        <span>CONNECTED</span>
      </div>
    </div>
  );
}
