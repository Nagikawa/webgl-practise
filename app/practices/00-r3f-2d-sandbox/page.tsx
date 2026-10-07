'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PracticeLoading } from "@/app/components/practice/PracticeLoading";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <PracticeLoading label="Loading 2D shader..." />,
});

export default function PracticePage() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 lg:p-12">
        <div className="pl-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Practice 00</p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-white">R3F 2D Shader Sandbox</h1>
        </div>
        <p className="max-w-sm font-mono text-xs leading-6 text-white/45">
          Orthographic camera + shader plane. This is the baseline for future 2D GLSL exercises.
        </p>
      </div>
    </main>
  );
}
