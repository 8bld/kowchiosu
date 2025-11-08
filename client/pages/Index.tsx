import CheatPanel from "@/components/CheatPanel";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-purple-100">
              Cheat Panel
            </h1>
            <p className="text-lg text-purple-300/80">
              Try dragging the panel, toggling features, and minimizing or closing it
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-purple-400/60">
              The cheat menu is floating in the top-left corner
            </p>
          </div>
        </div>
      </div>

      {/* Cheat Panel */}
      <CheatPanel />
    </div>
  );
}
