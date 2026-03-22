"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import CameraBackground from "./CameraBackground";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCapture = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const threeCanvas = container.querySelector("canvas:not(video + canvas)") as HTMLCanvasElement;
    const video = container.querySelector("video") as HTMLVideoElement;
    if (!threeCanvas) return;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    try {
      const compositeCanvas = document.createElement("canvas");
      compositeCanvas.width = threeCanvas.width;
      compositeCanvas.height = threeCanvas.height;
      const ctx = compositeCanvas.getContext("2d")!;

      // Draw camera feed first (if available)
      if (video && video.readyState >= 2) {
        // Cover-fit the video onto the canvas
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cw = compositeCanvas.width;
        const ch = compositeCanvas.height;
        const scale = Math.max(cw / vw, ch / vh);
        const sw = cw / scale;
        const sh = ch / scale;
        const sx = (vw - sw) / 2;
        const sy = (vh - sh) / 2;
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
      }

      // Draw 3D scene on top
      ctx.drawImage(threeCanvas, 0, 0);

      // Add watermark bar at bottom
      const barHeight = 60;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, compositeCanvas.height - barHeight, compositeCanvas.width, barHeight);

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
      const link = document.createElement("a");
      link.download = `thin-places-${stationName.toLowerCase().replace(/\s/g, "-")}.png`;
      link.href = threeCanvas.toDataURL("image/png");
      link.click();
    }
  }, [stationName, stationNumber]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Flash overlay */}
      {showFlash && <div className="capture-flash" />}

      {/* Camera feed (bottom layer) */}
      <CameraBackground />

      {/* 3D Canvas area (on top of camera, transparent background) */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
        {children}
      </div>

      {/* Top bar */}
      <div className="ar-overlay top-0 left-0 right-0 flex items-center justify-between px-4 py-4 sm:px-6" style={{ zIndex: 10 }}>
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
        <div className="w-12" />
      </div>

      {/* Bottom controls */}
      <div className="ar-overlay bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-4 pb-8 sm:pb-10" style={{ zIndex: 10 }}>
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 hover:shadow-lg"
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
      <div className="ar-overlay bottom-0 left-0 right-0 flex justify-center pb-2" style={{ zIndex: 10 }}>
        <p className="text-[10px] font-mono text-white/20">
          Drag to look around · Pinch to zoom · Tap capture to save
        </p>
      </div>
    </div>
  );
}
