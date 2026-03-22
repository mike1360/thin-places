import Link from "next/link";

const stations = [
  {
    id: "swarm",
    number: "01",
    title: "The Swarm",
    subtitle: "Living Particles",
    description:
      "Thousands of luminous entities swirl around you, drawn to your presence. You become the center of a living sculpture.",
    color: "from-violet-500/20 to-fuchsia-500/20",
    accent: "text-violet-400",
    borderAccent: "hover:border-violet-500/30",
  },
  {
    id: "portal",
    number: "02",
    title: "The Portal",
    subtitle: "Between Worlds",
    description:
      "A gateway hangs in the air before you. Step through and find yourself somewhere else entirely. Photograph a friend mid-crossing.",
    color: "from-cyan-500/20 to-blue-500/20",
    accent: "text-cyan-400",
    borderAccent: "hover:border-cyan-500/30",
  },
  {
    id: "giant",
    number: "03",
    title: "The Giant",
    subtitle: "Scale & Wonder",
    description:
      "Massive surreal objects tower above you — a twenty-foot eye watches, an enormous flower blooms. You are beautifully small.",
    color: "from-amber-500/20 to-orange-500/20",
    accent: "text-amber-400",
    borderAccent: "hover:border-amber-500/30",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6 font-mono">
            Art Space LA presents
          </p>
          <h1 className="text-6xl sm:text-8xl font-light tracking-tight glow mb-4">
            Thin Places
          </h1>
          <p className="text-lg sm:text-xl text-white/50 font-light max-w-md mx-auto mb-2">
            Where another world bleeds through
          </p>
          <p className="text-sm text-white/25 font-mono mb-16">
            An augmented reality experience
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#stations"
              className="px-8 py-3 border border-white/10 rounded-full text-sm tracking-wide hover:bg-white/5 transition-all"
            >
              Explore Stations
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 text-white/40 text-sm tracking-wide hover:text-white/70 transition-all"
            >
              About the Exhibition
            </Link>
          </div>
        </div>
      </section>

      {/* Stations */}
      <section id="stations" className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-12 font-mono">
          Stations
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {stations.map((station) => (
            <Link
              key={station.id}
              href={`/station/${station.id}`}
              className={`station-card rounded-2xl p-8 flex flex-col gap-4 ${station.borderAccent} group`}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-white/20">
                  {station.number}
                </span>
                <h2 className="text-2xl font-light tracking-tight">
                  {station.title}
                </h2>
              </div>
              <p className={`text-xs tracking-[0.2em] uppercase ${station.accent}`}>
                {station.subtitle}
              </p>
              <p className="text-sm text-white/40 leading-relaxed">
                {station.description}
              </p>
              <div className="mt-auto pt-4">
                <span className="text-xs text-white/20 group-hover:text-white/50 transition-colors font-mono">
                  Enter →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 text-center">
        <p className="text-xs text-white/20 font-mono">
          Point your phone at a QR code in the gallery to begin — or tap a station above to preview
        </p>
      </footer>
    </div>
  );
}
