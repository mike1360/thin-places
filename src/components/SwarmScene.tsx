"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 3000 }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 6;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Purple to pink gradient
      const t = Math.random();
      colors[i * 3] = 0.5 + t * 0.5; // R
      colors[i * 3 + 1] = 0.1 + t * 0.2; // G
      colors[i * 3 + 2] = 0.8 + t * 0.2; // B

      sizes[i] = 0.02 + Math.random() * 0.06;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const posArray = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      // Orbit around center with wave motion
      const dist = Math.sqrt(x * x + y * y + z * z);
      const speed = 0.3 / (dist * 0.5 + 0.5);

      posArray[i3] += Math.sin(time * speed + i) * 0.005;
      posArray[i3 + 1] += Math.cos(time * speed * 0.7 + i * 0.5) * 0.005;
      posArray[i3 + 2] += Math.sin(time * speed * 0.5 + i * 0.3) * 0.005;

      // Gentle pull toward center (breathing effect)
      const breathe = Math.sin(time * 0.5) * 0.002;
      posArray[i3] += -x * breathe;
      posArray[i3 + 1] += -y * breathe;
      posArray[i3 + 2] += -z * breathe;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;

    // Pulse the light
    if (light.current) {
      light.current.intensity = 1.5 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <>
      <pointLight ref={light} position={[0, 0, 0]} color="#a855f7" intensity={1.5} distance={15} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 1.5) * 0.5 + (i - 2) * 1.5;
      child.position.x = Math.cos(t * 0.3 + i * 2) * 2;
      child.position.z = Math.sin(t * 0.4 + i) * 2;
      child.scale.setScalar(0.8 + Math.sin(t + i) * 0.2);
    });
  });

  return (
    <group ref={group}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#a855f7" : "#ec4899"}
            emissive={i % 2 === 0 ? "#a855f7" : "#ec4899"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SwarmScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <color attach="background" args={["#050008"]} />
      <fog attach="fog" args={["#050008", 5, 15]} />
      <ambientLight intensity={0.1} />
      <Particles count={2000} />
      <FloatingOrbs />
      <OrbitControls
        enableZoom
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxDistance={12}
        minDistance={1}
      />
    </Canvas>
  );
}
