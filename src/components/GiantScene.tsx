"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GiantEye() {
  const groupRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = 4 + Math.sin(t * 0.3) * 0.5;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (irisRef.current) {
      irisRef.current.rotation.z = t * 0.15;
    }
    // Pupil dilates
    if (pupilRef.current) {
      const scale = 0.8 + Math.sin(t * 0.8) * 0.15;
      pupilRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 4, -3]}>
      {/* Outer eye (sclera) */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#f5f0e8"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Iris */}
      <mesh ref={irisRef} position={[0, 0, 2.3]}>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#d97706"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* Iris detail ring */}
      <mesh position={[0, 0, 2.31]}>
        <ringGeometry args={[0.6, 1.2, 64]} />
        <meshStandardMaterial
          color="#92400e"
          emissive="#b45309"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Pupil */}
      <mesh ref={pupilRef} position={[0, 0, 2.35]}>
        <circleGeometry args={[0.55, 64]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* Eye glow */}
      <pointLight position={[0, 0, 3]} color="#f59e0b" intensity={1} distance={8} />
    </group>
  );
}

function GiantFlower() {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(t * 0.4 + 1) * 0.3;
    }
    if (petalsRef.current) {
      petalsRef.current.rotation.y = t * 0.08;
      // Petals gently open and close
      petalsRef.current.children.forEach((petal, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const breathe = Math.sin(t * 0.5) * 0.1;
        petal.rotation.x = -0.4 + breathe;
        petal.position.x = Math.cos(angle) * (1.8 + breathe);
        petal.position.z = Math.sin(angle) * (1.8 + breathe);
        petal.rotation.y = angle;
      });
    }
  });

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.8, 0.5, 1, 2, 0, 3.5);
    shape.bezierCurveTo(-1, 2, -0.8, 0.5, 0, 0);
    return shape;
  }, []);

  return (
    <group ref={groupRef} position={[4, -0.5, -4]} rotation={[0, -0.5, 0]}>
      {/* Stem */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 6, 16]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      {/* Petals */}
      <group ref={petalsRef} position={[0, 0.5, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8]}
              rotation={[
                -0.4,
                angle,
                0,
              ]}
            >
              <shapeGeometry args={[petalShape]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#f97316" : "#fb923c"}
                emissive={i % 2 === 0 ? "#ea580c" : "#f97316"}
                emissiveIntensity={0.2}
                side={THREE.DoubleSide}
                roughness={0.6}
              />
            </mesh>
          );
        })}
      </group>
      {/* Center */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#854d0e"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 1, 0]} color="#f59e0b" intensity={0.8} distance={6} />
    </group>
  );
}

function FloatingCrystal() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = 2 + Math.sin(t * 0.6) * 1;
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={[-4, 2, -2]}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial
        color="#f59e0b"
        emissive="#d97706"
        emissiveIntensity={0.4}
        transparent
        opacity={0.7}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#1a1207"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function DustParticles({ count = 500 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 12 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.003;
      arr[i * 3] += Math.sin(t * 0.2 + i) * 0.001;
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f59e0b"
        size={0.04}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function GiantScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 8], fov: 65 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", touchAction: "none", background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#fbbf24" />
      <GiantEye />
      <GiantFlower />
      <FloatingCrystal />
      <GroundPlane />
      <DustParticles />
      <OrbitControls
        enableZoom
        enablePan
        autoRotate
        autoRotateSpeed={0.2}
        maxDistance={15}
        minDistance={2}
        maxPolarAngle={Math.PI * 0.85}
      />
    </Canvas>
  );
}
