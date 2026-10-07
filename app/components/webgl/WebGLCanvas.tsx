'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";
import * as THREE from "three";

type CameraOptions = {
  position?: [number, number, number];
  fov?: number;
  zoom?: number;
  near?: number;
  far?: number;
};

type WebGLCanvasProps = {
  children: ReactNode;
  mode?: "2d" | "3d";
  camera?: CameraOptions;
  orbit?: boolean;
  dpr?: [number, number];
};

export function WebGLCanvas({ children, mode = "3d", camera, orbit = false, dpr = [1, 2] }: WebGLCanvasProps) {
  const defaultCamera: CameraOptions = mode === "2d"
    ? { position: [0, 0, 5], zoom: 1 }
    : { position: [0, 0, 5.5], fov: 45 };

  return (
    <Canvas
      orthographic={mode === "2d"}
      camera={{ ...defaultCamera, ...camera }}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      className="absolute inset-0 block !h-full !w-full"
      style={{ position: "absolute", inset: 0, width: "100vw", height: "100dvh" }}
    >
      {children}
      {orbit && mode === "3d" ? <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.05} /> : null}
    </Canvas>
  );
}

export function WebGL2DCanvas(props: Omit<WebGLCanvasProps, "mode">) {
  return <WebGLCanvas {...props} mode="2d" />;
}

export function WebGL3DCanvas(props: Omit<WebGLCanvasProps, "mode">) {
  return <WebGLCanvas {...props} mode="3d" />;
}
