import CheatPanel from "@/components/CheatPanel";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 overflow-hidden">
      {/* Animated AI-themed background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top-left accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Bottom-right accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        {/* Grid lines effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.1) 75%, rgba(59, 130, 246, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.1) 75%, rgba(59, 130, 246, 0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-200">
              OSU Cheat Menu
            </h1>
            <p className="text-lg text-blue-300/80">
              Advanced AI-powered enhancement for rhythm gaming
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-blue-400/60">
              Drag the panel to position it, toggle features, and customize colors
            </p>
          </div>
        </div>
      </div>

      {/* Cheat Panel */}
      <CheatPanel />
    </div>
  );
}
