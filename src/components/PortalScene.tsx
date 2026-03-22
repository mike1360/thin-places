"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function PortalRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
    }
  });

  return (
    <group position={[0, 0.5, -2]}>
      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[2.2, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Main ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Inner portal surface */}
      <PortalSurface />
    </group>
  );
}

function PortalSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#0e7490") },
        uColor2: { value: new THREE.Color("#7c3aed") },
        uColor3: { value: new THREE.Color("#06b6d4") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        // Simplex-like noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);

          // Swirling noise
          float angle = atan(uv.y, uv.x);
          float n1 = snoise(vec2(angle * 2.0 + uTime * 0.3, dist * 4.0 - uTime * 0.5));
          float n2 = snoise(vec2(angle * 3.0 - uTime * 0.2, dist * 3.0 + uTime * 0.4));

          // Color mixing
          vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
          color = mix(color, uColor3, n2 * 0.3 + 0.3);

          // Brighten center
          color += (1.0 - dist * 2.0) * 0.3;

          // Edge fade
          float alpha = smoothstep(0.5, 0.3, dist);

          gl_FragColor = vec4(color, alpha * 0.9);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <circleGeometry args={[1.95, 64]} />
      <shaderMaterial
        ref={materialRef}
        {...shader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function FloatingDebris({ count = 200 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.002;
      // Slowly drift toward portal
      arr[i * 3 + 2] += 0.001;
      if (arr[i * 3 + 2] > 7) arr[i * 3 + 2] = -7;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#22d3ee" size={0.03} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function EnvironmentLight() {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2("#030818", 0.08);
  }, [scene]);
  return null;
}

export default function PortalScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 70 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <color attach="background" args={["#030818"]} />
      <EnvironmentLight />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0.5, -2]} color="#06b6d4" intensity={2} distance={10} />
      <pointLight position={[-3, 2, 1]} color="#7c3aed" intensity={0.5} distance={8} />
      <PortalRing />
      <FloatingDebris />
      <OrbitControls
        enableZoom
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.15}
        maxDistance={10}
        minDistance={1.5}
      />
    </Canvas>
  );
}
