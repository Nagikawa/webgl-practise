'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PracticeLoading } from "@/app/components/practice/PracticeLoading";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <PracticeLoading label="Loading Mondrian shader..." />,
});

export default function PracticePage() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 lg:p-12">
        <header className="pl-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Practice 02 / 2D
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-white lg:text-4xl">
            Piet Mondrian
          </h1>
          <p className="mt-2 max-w-md font-mono text-xs leading-5 text-white/50">
            A full-screen fragment shader study built from rectangles, masks, and
            a square letterboxed composition.
          </p>
        </header>

        <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/40">
          GLSL / ShaderMaterial / 2D Composition
        </p>
      </div>
    </main>
  );
}
