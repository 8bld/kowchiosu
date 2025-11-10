import { useState, useRef, useEffect } from "react";

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  value?: number;
}

interface Category {
  id: string;
  name: string;
  features: Feature[];
}

export default function CheatPanel() {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("aimbot");
  const [colors, setColors] = useState({
    bg: "#0f172a",
    accent: "#06b6d4",
    border: "#334155",
    text: "#ffffff",
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const [categories] = useState<Category[]>([
    {
      id: "aimbot",
      name: "Aimbot",
      features: [
        { id: "aimbot", label: "Aimbot", enabled: false, value: 50 },
        { id: "aim_fov", label: "Aim FOV", enabled: false, value: 90 },
        { id: "aim_smooth", label: "Aim Smoothing", enabled: false, value: 50 },
        { id: "aim_bone", label: "Aim Bone Select", enabled: false, value: 0 },
        { id: "visibility_check", label: "Visibility Check", enabled: false },
        { id: "lock_when_firing", label: "Lock When Firing", enabled: false },
      ],
    },
    {
      id: "esp",
      name: "ESP",
      features: [
        { id: "esp", label: "ESP Enable", enabled: false },
        { id: "wallhack", label: "Wallhack", enabled: false },
        { id: "distance_esp", label: "Distance ESP", enabled: false, value: 1000 },
        { id: "health_bar", label: "Health Bar", enabled: false },
        { id: "skeleton", label: "Skeleton ESP", enabled: false },
        { id: "box_esp", label: "Box ESP", enabled: false },
      ],
    },
    {
      id: "recoil",
      name: "Recoil",
      features: [
        { id: "no_recoil", label: "No Recoil", enabled: false, value: 100 },
        { id: "no_spread", label: "No Spread", enabled: false, value: 100 },
        { id: "auto_fire", label: "Auto Fire", enabled: false },
        { id: "rapid_fire", label: "Rapid Fire", enabled: false, value: 50 },
        { id: "bullet_penetration", label: "Bullet Penetration", enabled: false },
      ],
    },
    {
      id: "movement",
      name: "Movement",
      features: [
        { id: "bunny_hop", label: "Bunny Hop", enabled: false },
        { id: "crouch_cancel", label: "Crouch Cancel", enabled: false },
        { id: "speed_boost", label: "Speed Boost", enabled: false, value: 50 },
        { id: "jump_height", label: "Jump Height", enabled: false, value: 50 },
        { id: "slide_cancel", label: "Slide Cancel", enabled: false },
        { id: "dolphin_dive", label: "Dolphin Dive", enabled: false },
      ],
    },
    {
      id: "visual",
      name: "Visual",
      features: [
        { id: "kill_effects", label: "Kill Effects", enabled: false },
        { id: "blood_effects", label: "Blood Effects", enabled: false },
        { id: "neon_glow", label: "Neon Glow", enabled: false },
        { id: "tracers", label: "Tracers", enabled: false },
        { id: "custom_camo", label: "Custom Camo", enabled: false },
      ],
    },
    {
      id: "sensitivity",
      name: "Sensitivity",
      features: [
        { id: "aim_sense", label: "ADS Sensitivity", enabled: false, value: 50 },
        { id: "regular_sense", label: "Regular Sensitivity", enabled: false, value: 50 },
        { id: "aim_assist", label: "Aim Assist Strength", enabled: false, value: 50 },
        { id: "deadzone", label: "Deadzone", enabled: false, value: 5 },
      ],
    },
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
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  return (
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "1000px",
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-6 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
        style={{
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.bg,
        }}
      >
        <div className="flex items-center gap-2">
          <div style={{ width: "3px", height: "3px", backgroundColor: colors.accent }} />
          <h1 className="text-base font-bold" style={{ color: colors.text }}>
            BRYAN GUI
          </h1>
        </div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-xs hover:opacity-70 transition-opacity" style={{ color: colors.text }}>
            _
          </button>
          <button className="px-2 py-1 text-xs hover:opacity-70 transition-opacity" style={{ color: colors.text }}>
            X
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex overflow-x-auto text-xs"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="px-4 py-2 font-semibold transition-colors"
            style={{
              color: activeTab === cat.id ? colors.accent : "rgba(255,255,255,0.5)",
              borderBottom: activeTab === cat.id ? `2px solid ${colors.accent}` : "none",
              backgroundColor: activeTab === cat.id ? `${colors.accent}10` : "transparent",
            }}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setActiveTab("settings")}
          className="px-4 py-2 font-semibold ml-auto transition-colors"
          style={{
            color: activeTab === "settings" ? colors.accent : "rgba(255,255,255,0.5)",
            borderBottom: activeTab === "settings" ? `2px solid ${colors.accent}` : "none",
            backgroundColor: activeTab === "settings" ? `${colors.accent}10` : "transparent",
          }}
        >
          ⚙ GUI
        </button>
      </div>

      {/* Content */}
      <div style={{ height: "450px", overflow: "hidden" }}>
        {activeTab === "settings" ? (
          <div className="p-5 h-full overflow-y-auto" style={{ backgroundColor: colors.bg }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Panic Button */}
              <div style={{ gridColumn: "1 / -1" }}>
                <button
                  onClick={() => alert("PANIC ACTIVATED")}
                  className="w-full py-3 font-bold transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "#dc2626",
                    color: colors.text,
                    border: `1px solid #991b1b`,
                    fontSize: "14px",
                  }}
                >
                  ⚠ PANIC BUTTON
                </button>
              </div>

              {/* Color Pickers */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colors.text }}>
                  Main Color
                </label>
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  style={{
                    width: "100%",
                    height: "32px",
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colors.text }}>
                  Background
                </label>
                <input
                  type="color"
                  value={colors.bg}
                  onChange={(e) => setColors({ ...colors, bg: e.target.value })}
                  style={{
                    width: "100%",
                    height: "32px",
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colors.text }}>
                  Border Color
                </label>
                <input
                  type="color"
                  value={colors.border}
                  onChange={(e) => setColors({ ...colors, border: e.target.value })}
                  style={{
                    width: "100%",
                    height: "32px",
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colors.text }}>
                  Text Color
                </label>
                <input
                  type="color"
                  value={colors.text}
                  onChange={(e) => setColors({ ...colors, text: e.target.value })}
                  style={{
                    width: "100%",
                    height: "32px",
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        ) : activeCategory ? (
          <div className="p-4 h-full overflow-y-auto" style={{ backgroundColor: colors.bg }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {activeCategory.features.map((feat) => (
                <div
                  key={feat.id}
                  style={{
                    padding: "8px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: feat.enabled ? `${colors.accent}15` : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      onChange={() => {}}
                      style={{
                        width: "14px",
                        height: "14px",
                        cursor: "pointer",
                        accentColor: colors.accent,
                      }}
                    />
                    <label style={{ fontSize: "12px", fontWeight: "600", color: colors.text, cursor: "pointer" }}>
                      {feat.label}
                    </label>
                  </div>
                  {feat.value !== undefined && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={feat.value}
                      style={{
                        width: "100%",
                        height: "4px",
                        cursor: "pointer",
                        accentColor: colors.accent,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-2 flex justify-between text-xs"
        style={{
          borderTop: `1px solid ${colors.border}`,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <span>Advanced Cheats v2.0</span>
        <span>BRYAN</span>
      </div>
    </div>
  );
}
