"use client";

import { Component, Suspense, useState, useEffect, type ReactNode } from "react";

// Error boundary class component
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: (error: Error) => ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

function LoadingSpinner({ label, color }: { label: string; color: string }) {
  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="text-center">
        <div
          className="w-8 h-8 rounded-full animate-spin mx-auto mb-4"
          style={{ border: `1px solid ${color}44`, borderTopColor: color }}
        />
        <p className="text-xs font-mono text-white/30">{label}</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, stationName }: { error: Error; stationName: string }) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center px-8 max-w-sm">
        <p className="text-sm text-white/50 mb-2">Could not load {stationName}</p>
        <p className="text-xs font-mono text-red-400/60 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-mono text-white/40 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function SceneLoader({
  stationName,
  color,
  loadingLabel,
  children,
}: {
  stationName: string;
  color: string;
  loadingLabel: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner label={loadingLabel} color={color} />;
  }

  return (
    <ErrorBoundary fallback={(error) => <ErrorDisplay error={error} stationName={stationName} />}>
      <Suspense fallback={<LoadingSpinner label={loadingLabel} color={color} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
