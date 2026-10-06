'use client';

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { WebGL2DCanvas } from "@/app/components/webgl/WebGLCanvas";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= 1.4;

    float wave = sin(p.x * 12.0 + uTime) * 0.03;
    float dist = length(vec2(p.x, p.y + wave));
    float glow = smoothstep(0.42, 0.0, dist);
    float pointerGlow = smoothstep(0.55, 0.0, length(uv - (uPointer * 0.5 + 0.5)));

    vec3 base = vec3(0.01, 0.02, 0.05);
    vec3 cyan = vec3(0.1, 0.7, 1.0);
    vec3 violet = vec3(0.65, 0.15, 1.0);
    vec3 color = base + cyan * glow * 0.55 + violet * pointerGlow * 0.35;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2());
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    elapsed.current += delta;
    pointer.current.lerp(state.pointer, 0.08);

    materialRef.current.uniforms.uTime.value = elapsed.current;
    materialRef.current.uniforms.uPointer.value.copy(pointer.current);
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
        }}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <WebGL2DCanvas camera={{ position: [0, 0, 1], zoom: 1 }}>
      <ShaderPlane />
    </WebGL2DCanvas>
  );
}
