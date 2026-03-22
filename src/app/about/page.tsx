import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-24">
      <div className="max-w-lg w-full">
        <Link
          href="/"
          className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors mb-12 block"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-light tracking-tight glow mb-2">
          Thin Places
        </h1>
        <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-mono mb-12">
          About the Exhibition
        </p>

        <div className="space-y-6 text-sm text-white/50 leading-relaxed">
          <p>
            In Celtic tradition, <em className="text-white/70">thin places</em> are
            locations where the boundary between the physical world and the
            otherworld becomes almost transparent. You can feel the other side
            pressing through.
          </p>
          <p>
            This exhibition transforms Art Space LA into a series of thin places.
            Using augmented reality — accessed through nothing more than your
            phone&apos;s camera — each station reveals a hidden layer of reality
            occupying the same space as you.
          </p>
          <p>
            There is no app to download. Simply scan the QR code at each station
            and look through your screen. What you see exists between your world
            and another.
          </p>
          <p>
            The works are designed to be experienced <em className="text-white/70">with</em> other
            people. Photograph your companions inside these spaces. Watch them
            stand in the swarm, step through the portal, or shrink beneath the
            gaze of something vast. The best art here is made by you.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/20 font-mono">
            An augmented reality exhibition by Art Space LA
          </p>
          <p className="text-xs text-white/10 font-mono mt-1">
            Built with WebXR · Three.js · Next.js
          </p>
        </div>
      </div>
    </div>
  );
}
