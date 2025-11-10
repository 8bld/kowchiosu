import { useState, useRef, useEffect } from "react";
import {
  Target,
  Eye,
  Wind,
  Zap,
  Ghost,
  Gauge,
  Menu,
  X,
  Minus,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface Feature {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: string;
}

function RotatingModel() {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={meshRef}>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  );
}

const featureIcons: Record<string, React.ReactNode> = {
  aimbot: <Target size={20} />,
  prediction: <Gauge size={20} />,
  sticky: <Zap size={20} />,
  esp: <Eye size={20} />,
  boxes: <Target size={20} />,
  names: <Eye size={20} />,
  distance: <Gauge size={20} />,
  fly: <Wind size={20} />,
  cframe: <Zap size={20} />,
  noclip: <Ghost size={20} />,
  speed: <Gauge size={20} />,
  invisible: <Ghost size={20} />,
};

export default function CheatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "aimbot",
      label: "Aimbot",
      icon: featureIcons.aimbot,
      enabled: false,
      category: "Combat",
    },
    {
      id: "prediction",
      label: "Prediction",
      icon: featureIcons.prediction,
      enabled: false,
      category: "Combat",
    },
    {
      id: "sticky",
      label: "Sticky Aim",
      icon: featureIcons.sticky,
      enabled: false,
      category: "Combat",
    },
    {
      id: "esp",
      label: "ESP",
      icon: featureIcons.esp,
      enabled: false,
      category: "Vision",
    },
    {
      id: "boxes",
      label: "Boxes",
      icon: featureIcons.boxes,
      enabled: false,
      category: "Vision",
    },
    {
      id: "names",
      label: "Names",
      icon: featureIcons.names,
      enabled: false,
      category: "Vision",
    },
    {
      id: "distance",
      label: "Distance",
      icon: featureIcons.distance,
      enabled: false,
      category: "Vision",
    },
    {
      id: "fly",
      label: "Fly",
      icon: featureIcons.fly,
      enabled: false,
      category: "Movement",
    },
    {
      id: "cframe",
      label: "CFrame",
      icon: featureIcons.cframe,
      enabled: false,
      category: "Movement",
    },
    {
      id: "noclip",
      label: "Noclip",
      icon: featureIcons.noclip,
      enabled: false,
      category: "Movement",
    },
    {
      id: "speed",
      label: "Speed",
      icon: featureIcons.speed,
      enabled: false,
      category: "Movement",
    },
    {
      id: "invisible",
      label: "Invisible",
      icon: featureIcons.invisible,
      enabled: false,
      category: "Survival",
    },
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
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

  const categories = ["Combat", "Vision", "Movement", "Survival"];
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
      <div className="w-screen max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              BRYAN GUI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-100 font-medium">
              [{activeCount}/{features.length}]
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
            >
              <Minus size={18} className="text-white" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex h-96">
            {/* 3D Model Viewer */}
            <div className="w-1/3 bg-slate-900/50 border-r border-slate-700/50">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, 10]} intensity={0.5} />
                <RotatingModel />
                <OrbitControls autoRotate autoRotateSpeed={4} />
              </Canvas>
            </div>

            {/* Features Grid */}
            <div className="w-2/3 p-4 overflow-y-auto bg-slate-800/30">
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`group p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                      feature.enabled
                        ? "bg-indigo-600/40 border-indigo-500 text-indigo-100"
                        : "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-600/40 hover:border-slate-500"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        feature.enabled
                          ? "bg-indigo-500/50"
                          : "bg-slate-600/50 group-hover:bg-slate-500/50"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold flex-1 text-left">
                      {feature.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        feature.enabled
                          ? "bg-indigo-400 border-indigo-300"
                          : "bg-transparent border-slate-500"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Category Legend */}
              <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400 space-y-1">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-900/50 px-6 py-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <span className="text-green-400 font-medium">●</span>
            <span className="text-slate-300">Active</span>
          </div>
          <div className="text-slate-500 text-xs">v1.0 • Bryan GUI</div>
        </div>
      </div>
    </div>
  );
}
