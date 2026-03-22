"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface ARSessionWrapperProps {
  stationName: string;
  stationNumber: string;
  accentColor: string;
  children: React.ReactNode;
}

export default function ARSessionWrapper({
  stationName,
  stationNumber,
  accentColor,
  children,
}: ARSessionWrapperProps) {
  const [showFlash, setShowFlash] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCapture = useCallback(async () => {
    // Find the canvas element
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    try {
      // Create a composite image with the watermark
      const compositeCanvas = document.createElement("canvas");
      compositeCanvas.width = canvas.width;
      compositeCanvas.height = canvas.height;
      const ctx = compositeCanvas.getContext("2d")!;

      // Draw the AR scene
      ctx.drawImage(canvas, 0, 0);

      // Add watermark bar at bottom
      const barHeight = 60;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, compositeCanvas.height - barHeight, compositeCanvas.width, barHeight);

      // Watermark text
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "14px monospace";
      ctx.fillText(
        `THIN PLACES — ${stationNumber} ${stationName.toUpperCase()}`,
        20,
        compositeCanvas.height - 25
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "11px monospace";
      ctx.fillText("Art Space LA", compositeCanvas.width - 120, compositeCanvas.height - 25);

      // Download
      const link = document.createElement("a");
      link.download = `thin-places-${stationName.toLowerCase().replace(/\s/g, "-")}.png`;
      link.href = compositeCanvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: just screenshot the canvas
      const link = document.createElement("a");
      link.download = `thin-places-${stationName.toLowerCase().replace(/\s/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, [stationName, stationNumber]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Flash overlay */}
      {showFlash && <div className="capture-flash" />}

      {/* 3D Canvas area */}
      <div ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {children}
      </div>

      {/* Top bar */}
      <div className="ar-overlay top-0 left-0 right-0 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back
        </Link>
        <div className="text-center">
          <p className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">
            Station {stationNumber}
          </p>
          <p className="text-sm font-light tracking-wide">{stationName}</p>
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Bottom controls */}
      <div className="ar-overlay bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-4 pb-8 sm:pb-10">
        {/* Capture button */}
        <button
          onClick={handleCapture}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 hover:shadow-lg`}
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 20px ${accentColor}33`,
          }}
          title="Capture"
        >
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: `${accentColor}22`, border: `1px solid ${accentColor}66` }}
          />
        </button>
      </div>

      {/* Hint text */}
      <div className="ar-overlay bottom-0 left-0 right-0 flex justify-center pb-2">
        <p className="text-[10px] font-mono text-white/20">
          Drag to look around · Pinch to zoom · Tap capture to save
        </p>
      </div>
    </div>
  );
}
