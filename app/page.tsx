import Link from "next/link";
import { practices } from "@/app/data/practices";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white lg:pl-72">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:px-16">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/35">WebGL Laboratory</p>
          <h1 className="mt-5 text-5xl font-light tracking-tight sm:text-7xl">WebGL Practice</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/50">
            One route, one experiment, one GPU idea at a time. Each practice is isolated so
            learning a new WebGL concept does not require touching the previous experiment.
          </p>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2">
          {practices.map((practice) => (
            <Link
              key={practice.slug}
              href={`/practices/${practice.slug}`}
              prefetch={false}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {practice.kind}
                </span>
                <span className="font-mono text-[10px] text-white/20">/{practice.slug}</span>
              </div>
              <h2 className="mt-10 text-xl text-white/85 group-hover:text-white">{practice.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/40">{practice.description}</p>
            </Link>
          ))}
        </div>

        <p className="mt-10 max-w-xl font-mono text-[11px] leading-6 text-white/25">
          Add a new folder under app/practices and one metadata entry under app/data/practices.ts.
        </p>
      </div>
    </main>
  );
}
