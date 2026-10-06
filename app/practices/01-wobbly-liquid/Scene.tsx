'use client';

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { ContactShadows, Environment } from "@react-three/drei";
import { WebGL3DCanvas } from "@/app/components/webgl/WebGLCanvas";
import CosmeticBottle from "./CosmeticBottle";

export default function Scene() {
  return (
    <WebGL3DCanvas orbit camera={{ position: [0, 0, 5.5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={3} />
      <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#e0e7ff" />
      <Environment preset="studio" environmentIntensity={1.5} />
      <CosmeticBottle />
      <ContactShadows position={[0, -2, 0]} opacity={1} scale={50} blur={2} far={20} color="#ffffff" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.8} radius={0.5} />
      </EffectComposer>
    </WebGL3DCanvas>
  );
}
