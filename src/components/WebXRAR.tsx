"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface PlacedArtwork {
  mesh: THREE.Group;
  position: THREE.Vector3;
}

// Artwork definitions — framed pieces that get placed in AR
const ARTWORKS = [
  {
    name: "Chromatic Pulse",
    color1: "#a855f7",
    color2: "#ec4899",
    style: "gradient",
  },
  {
    name: "Deep Geometry",
    color1: "#06b6d4",
    color2: "#3b82f6",
    style: "geometric",
  },
  {
    name: "Solar Flare",
    color1: "#f59e0b",
    color2: "#ef4444",
    style: "radial",
  },
  {
    name: "Void Study",
    color1: "#1e1b4b",
    color2: "#7c3aed",
    style: "minimal",
  },
  {
    name: "Neon Garden",
    color1: "#10b981",
    color2: "#06b6d4",
    style: "organic",
  },
];

function createArtworkTexture(
  artwork: (typeof ARTWORKS)[number],
  time: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const c1 = artwork.color1;
  const c2 = artwork.color2;

  switch (artwork.style) {
    case "gradient": {
      const grad = ctx.createLinearGradient(
        0,
        0,
        512 * Math.cos(time * 0.5),
        512 * Math.sin(time * 0.3)
      );
      grad.addColorStop(0, c1);
      grad.addColorStop(0.5, c2);
      grad.addColorStop(1, c1);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      // Add flowing circles
      for (let i = 0; i < 8; i++) {
        const x = 256 + Math.sin(time * 0.7 + i * 0.8) * 150;
        const y = 256 + Math.cos(time * 0.5 + i * 1.1) * 150;
        const r = 30 + Math.sin(time + i) * 20;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${c2}66`;
        ctx.fill();
      }
      break;
    }
    case "geometric": {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.translate(256, 256);
        ctx.rotate(time * 0.2 + (i * Math.PI) / 6);
        const size = 60 + i * 15 + Math.sin(time + i) * 10;
        ctx.strokeStyle = i % 2 === 0 ? c1 : c2;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
      break;
    }
    case "radial": {
      const radGrad = ctx.createRadialGradient(
        256 + Math.sin(time * 0.4) * 50,
        256 + Math.cos(time * 0.3) * 50,
        10,
        256,
        256,
        300
      );
      radGrad.addColorStop(0, c1);
      radGrad.addColorStop(0.4, c2);
      radGrad.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 512, 512);
      // Rays
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + time * 0.1;
        ctx.beginPath();
        ctx.moveTo(256, 256);
        ctx.lineTo(256 + Math.cos(angle) * 350, 256 + Math.sin(angle) * 350);
        ctx.strokeStyle = `${c1}33`;
        ctx.lineWidth = 8;
        ctx.stroke();
      }
      break;
    }
    case "minimal": {
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, 512, 512);
      const cx = 256 + Math.sin(time * 0.6) * 80;
      const cy = 256 + Math.cos(time * 0.4) * 80;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = c2;
      ctx.fill();
      break;
    }
    case "organic": {
      ctx.fillStyle = "#050f0a";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const x = Math.sin(time * 0.3 + i * 0.5) * 200 + 256;
        const y = Math.cos(time * 0.2 + i * 0.7) * 200 + 256;
        const r = 20 + Math.sin(time * 0.8 + i) * 15;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? `${c1}88` : `${c2}88`;
        ctx.fill();
      }
      // Connecting lines
      ctx.strokeStyle = `${c1}33`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 19; i++) {
        const x1 = Math.sin(time * 0.3 + i * 0.5) * 200 + 256;
        const y1 = Math.cos(time * 0.2 + i * 0.7) * 200 + 256;
        const x2 = Math.sin(time * 0.3 + (i + 1) * 0.5) * 200 + 256;
        const y2 = Math.cos(time * 0.2 + (i + 1) * 0.7) * 200 + 256;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
    }
  }

  return canvas;
}

function createFramedArtwork(
  scene: THREE.Scene,
  artworkIndex: number
): THREE.Group {
  const group = new THREE.Group();

  // Frame
  const frameWidth = 0.6;
  const frameHeight = 0.6;
  const frameDepth = 0.04;
  const borderSize = 0.03;

  // Outer frame (dark wood)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a0a,
    roughness: 0.4,
    metalness: 0.3,
  });

  // Top
  const topBar = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + borderSize * 2, borderSize, frameDepth),
    frameMat
  );
  topBar.position.set(0, frameHeight / 2 + borderSize / 2, 0);
  group.add(topBar);

  // Bottom
  const bottomBar = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + borderSize * 2, borderSize, frameDepth),
    frameMat
  );
  bottomBar.position.set(0, -frameHeight / 2 - borderSize / 2, 0);
  group.add(bottomBar);

  // Left
  const leftBar = new THREE.Mesh(
    new THREE.BoxGeometry(borderSize, frameHeight, frameDepth),
    frameMat
  );
  leftBar.position.set(-frameWidth / 2 - borderSize / 2, 0, 0);
  group.add(leftBar);

  // Right
  const rightBar = new THREE.Mesh(
    new THREE.BoxGeometry(borderSize, frameHeight, frameDepth),
    frameMat
  );
  rightBar.position.set(frameWidth / 2 + borderSize / 2, 0, 0);
  group.add(rightBar);

  // Canvas/artwork surface
  const artCanvas = document.createElement("canvas");
  artCanvas.width = 512;
  artCanvas.height = 512;
  const texture = new THREE.CanvasTexture(artCanvas);
  texture.needsUpdate = true;

  const artMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(frameWidth, frameHeight),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  artMesh.position.z = frameDepth / 2 + 0.001;
  artMesh.userData = { artworkIndex, texture, artCanvas };
  group.add(artMesh);

  // Backing
  const backMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(frameWidth, frameHeight),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  backMesh.position.z = -frameDepth / 2;
  backMesh.rotation.y = Math.PI;
  group.add(backMesh);

  // Spotlight pointing at the artwork
  const spotlight = new THREE.SpotLight(0xfff5e6, 2, 3, Math.PI / 6, 0.5);
  spotlight.position.set(0, 0.5, 0.5);
  spotlight.target = artMesh;
  group.add(spotlight);
  group.add(spotlight.target);

  // Label
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 256;
  labelCanvas.height = 64;
  const lctx = labelCanvas.getContext("2d")!;
  lctx.fillStyle = "#ffffff";
  lctx.font = "14px monospace";
  lctx.fillText(ARTWORKS[artworkIndex].name, 10, 30);
  lctx.fillStyle = "#666666";
  lctx.font = "10px monospace";
  lctx.fillText("Thin Places Collection", 10, 48);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  const labelMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.07),
    new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true })
  );
  labelMesh.position.set(0, -frameHeight / 2 - 0.08, frameDepth / 2 + 0.001);
  group.add(labelMesh);

  return group;
}

export default function WebXRAR() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"checking" | "ar-ready" | "ar-active" | "unsupported" | "error">("checking");
  const [message, setMessage] = useState("Checking AR support...");
  const [placedCount, setPlacedCount] = useState(0);
  const [currentArtwork, setCurrentArtwork] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  // Refs for AR session
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sessionRef = useRef<XRSession | null>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const placedRef = useRef<PlacedArtwork[]>([]);
  const clockRef = useRef(new THREE.Clock());

  const handleCapture = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
    try {
      const link = document.createElement("a");
      link.download = `thin-places-gallery-${Date.now()}.png`;
      link.href = renderer.domElement.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.warn("Capture failed:", e);
    }
  }, []);

  // Check AR support
  useEffect(() => {
    async function check() {
      if (!navigator.xr) {
        setStatus("unsupported");
        setMessage("WebXR not supported on this device. Try Chrome on Android for full AR.");
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported("immersive-ar");
        if (supported) {
          setStatus("ar-ready");
          setMessage("Tap 'Enter AR' to start placing artwork in your space");
        } else {
          setStatus("unsupported");
          setMessage("Immersive AR not supported. Try Chrome on Android for full AR, or use AR Quick Look on iOS.");
        }
      } catch {
        setStatus("unsupported");
        setMessage("Could not check AR support. Try Chrome on Android.");
      }
    }
    check();
  }, []);

  // Start AR session
  const startAR = useCallback(async () => {
    if (!navigator.xr) return;

    try {
      const container = containerRef.current!;

      // Setup Three.js
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      cameraRef.current = camera;

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0, 5, 5);
      scene.add(dirLight);

      // Reticle (placement indicator)
      const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
        })
      );
      reticle.visible = false;
      reticle.matrixAutoUpdate = false;
      scene.add(reticle);
      reticleRef.current = reticle;

      // Request AR session
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: container.parentElement
          ? { root: container.parentElement }
          : undefined,
      });
      sessionRef.current = session;

      renderer.xr.setReferenceSpaceType("local");
      await renderer.xr.setSession(session);

      // Hit test source
      const viewerSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource!({
        space: viewerSpace,
      });
      hitTestSourceRef.current = hitTestSource ?? null;

      setStatus("ar-active");
      setMessage("Point at a surface. Tap to place artwork.");

      // Handle select (tap) to place artwork
      session.addEventListener("select", () => {
        const reticle = reticleRef.current;
        if (reticle && reticle.visible && sceneRef.current) {
          const artwork = createFramedArtwork(sceneRef.current, currentArtwork);
          artwork.position.setFromMatrixPosition(reticle.matrix);
          // Face the camera
          const cameraPos = new THREE.Vector3();
          cameraRef.current?.getWorldPosition(cameraPos);
          artwork.lookAt(cameraPos);
          // But keep upright
          artwork.rotation.x = 0;
          artwork.rotation.z = 0;

          sceneRef.current.add(artwork);
          placedRef.current.push({
            mesh: artwork,
            position: artwork.position.clone(),
          });
          setPlacedCount((c) => c + 1);
          setCurrentArtwork((c) => (c + 1) % ARTWORKS.length);
        }
      });

      // Render loop
      renderer.setAnimationLoop((timestamp, frame) => {
        if (!frame) return;

        // Update hit test
        const hitTestSource = hitTestSourceRef.current;
        if (hitTestSource) {
          const refSpace = renderer.xr.getReferenceSpace();
          if (refSpace) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length > 0) {
              const hit = hitTestResults[0];
              const pose = hit.getPose(refSpace);
              if (pose && reticleRef.current) {
                reticleRef.current.visible = true;
                reticleRef.current.matrix.fromArray(pose.transform.matrix);
              }
            } else {
              if (reticleRef.current) reticleRef.current.visible = false;
            }
          }
        }

        // Animate artwork textures
        const time = clockRef.current.getElapsedTime();
        sceneRef.current?.traverse((obj) => {
          if (obj.userData.artworkIndex !== undefined) {
            const { artworkIndex, texture, artCanvas } = obj.userData;
            const artData = ARTWORKS[artworkIndex];
            const newCanvas = createArtworkTexture(artData, time);
            const ctx = artCanvas.getContext("2d")!;
            ctx.drawImage(newCanvas, 0, 0);
            texture.needsUpdate = true;
          }
        });

        renderer.render(scene, camera);
      });

      // Cleanup on session end
      session.addEventListener("end", () => {
        setStatus("ar-ready");
        setMessage("AR session ended. Tap to restart.");
        renderer.setAnimationLoop(null);
        container.removeChild(renderer.domElement);
        renderer.dispose();
        rendererRef.current = null;
        placedRef.current = [];
        setPlacedCount(0);
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus("error");
      setMessage(`AR failed: ${msg}`);
      console.error("AR error:", e);
    }
  }, [currentArtwork]);

  return (
    <div className="relative w-full h-screen bg-black text-white">
      {showFlash && <div className="capture-flash" />}

      {/* AR canvas gets injected here */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* UI overlay — only shown when NOT in active AR (dom-overlay handles in-session UI) */}
      {status !== "ar-active" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-[#0a0a1a] to-[#0a0010]">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-mono mb-4">
            Station 04
          </p>
          <h1 className="text-4xl font-light tracking-tight glow mb-2">
            The Gallery
          </h1>
          <p className="text-sm text-white/40 mb-8 max-w-xs">
            Place animated artwork on real surfaces in your space
          </p>

          <p className="text-xs text-white/30 font-mono mb-8 max-w-sm">
            {message}
          </p>

          {status === "ar-ready" && (
            <button
              onClick={startAR}
              className="px-8 py-3 bg-white/10 border border-white/20 rounded-full text-sm tracking-wide hover:bg-white/15 transition-all active:scale-95"
            >
              Enter AR
            </button>
          )}

          {status === "unsupported" && (
            <div className="space-y-4">
              <p className="text-xs text-amber-400/70 font-mono max-w-sm">
                For the full AR experience, open this page in Chrome on an Android device with ARCore.
              </p>
              <p className="text-xs text-white/20 font-mono">
                iOS support is limited — try viewing 3D models via Safari&apos;s AR Quick Look.
              </p>
            </div>
          )}

          {status === "checking" && (
            <div className="w-6 h-6 border border-white/30 rounded-full animate-spin border-t-white/70" />
          )}
        </div>
      )}

      {/* In-session UI overlay */}
      {status === "ar-active" && (
        <>
          {/* Top info */}
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none">
            <button
              onClick={() => sessionRef.current?.end()}
              className="text-xs font-mono text-white/60 bg-black/40 px-3 py-1.5 rounded-full pointer-events-auto backdrop-blur-sm"
            >
              ← Exit AR
            </button>
            <div className="text-center">
              <p className="text-[10px] font-mono text-white/40">
                {placedCount} artwork{placedCount !== 1 ? "s" : ""} placed
              </p>
              <p className="text-xs text-white/60">
                Next: {ARTWORKS[currentArtwork].name}
              </p>
            </div>
            <button
              onClick={handleCapture}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center pointer-events-auto bg-black/30 backdrop-blur-sm active:scale-90"
            >
              <div className="w-7 h-7 rounded-full border border-white/50" />
            </button>
          </div>

          {/* Bottom hint */}
          <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <p className="text-[11px] font-mono text-white/50 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              Tap a surface to place &ldquo;{ARTWORKS[currentArtwork].name}&rdquo;
            </p>
          </div>
        </>
      )}
    </div>
  );
}
