'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PracticeLoading } from "@/app/components/practice/PracticeLoading";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <PracticeLoading label="Loading bottle / GLSL / postprocessing..." />,
});

export default function PracticePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 lg:pl-72">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 lg:p-12">
        <header className="flex items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Practice 01</p>
            <h1 className="mt-3 text-2xl font-bold tracking-widest text-white lg:text-3xl">PITANIUM</h1>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Creative Technologist / GLSL Demo
          </span>
        </header>

        <div className="max-w-md">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-pink-300">
            PBR &amp; Custom GLSL Shader
          </p>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
            Hyper-Realistic Fluid Glass Simulation
          </h2>
          <p className="text-sm leading-relaxed text-neutral-400">
            Procedural vertex displacement combined with custom fragment shading and glass transmission.
          </p>
        </div>
      </div>
    </main>
  );
}
