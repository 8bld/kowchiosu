import CheatPanel from "@/components/CheatPanel";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 overflow-hidden">
      {/* Animated futuristic background with pink accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top-left pink accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Bottom-right pink accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Center glow with pink tint */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        {/* Grid lines effect with pink tint */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(236, 72, 153, 0.1) 25%, rgba(236, 72, 153, 0.1) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.1) 75%, rgba(236, 72, 153, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(236, 72, 153, 0.1) 25%, rgba(236, 72, 153, 0.1) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.1) 75%, rgba(236, 72, 153, 0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200">
              KOWCHI
            </h1>
            <p className="text-lg text-pink-300/80">
              Advanced AI-powered enhancement for rhythm gaming
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-pink-400/60">
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
