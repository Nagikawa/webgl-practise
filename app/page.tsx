// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// dynamic load R3F Canvas, incase ERROR loading WebGL API during SSR
const CanvasScene = dynamic(() => import('@/app/components/CanvasScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 font-mono text-sm">
      Loading 3D Engine & Shaders...
    </div>
  ),
});

export default function Page() {
  return (
    <main className="relative w-full h-screen bg-neutral-950 overflow-hidden">
      {/* 2D 高级排版层 */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-12">
        <header className="flex justify-between items-center">
          <h1 className="text-white font-bold tracking-widest text-2xl uppercase">PITANIUM</h1>
          <span className="text-neutral-400 text-xs tracking-wider">CREATIVE TECHNOLOGIST / GLSL DEMO</span>
        </header>

        <div className="max-w-md">
          <p className="text-pink-300 text-xs font-mono mb-2">PBR & CUSTOM GLSL SHADER</p>
          <h2 className="text-4xl text-white font-light tracking-tight mb-4">Hyper-Realistic Fluid Glass Simulation</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Procedural vertex displacement combined with Fresnel refraction fragment calculations for interactive liquid textures.
          </p>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Suspense fallback={null}>
        <CanvasScene />
      </Suspense>
    </main>
  );
}