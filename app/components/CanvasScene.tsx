'use client';

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import CosmeticBottle from './cosmetic-bottle/CosmeticBottle';
import * as THREE from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export default function CanvasScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5.5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ 
                antialias: true, 
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,   
                toneMappingExposure: 1.2,
            }}
            className="w-full h-full"
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={3.0} />
            <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#e0e7ff" />
            
            {/* give HDRI environment light */}
            <Environment preset="studio" environmentIntensity={1.5} />
            {/* a cosmetic bottle witch support fluid simulation */}
            <CosmeticBottle />
            {/* @TODO switch between different WebGL examples */}

            <ContactShadows
                position={[0, -2, 0]}
                opacity={1}
                scale={50}
                blur={2}
                far={20}
                color="#ffffff"
            />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.85} // 只对亮于 0.85 的极亮部分（玻璃高光切线）生效
                    mipmapBlur
                    intensity={0.8}
                    radius={0.5}
                />
            </EffectComposer>

            <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.05} />
        </Canvas>
    );
}