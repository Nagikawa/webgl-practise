"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { practices } from "@/app/data/practices";

export function PracticeNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close practice navigation" : "Open practice navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:border-white/30 hover:bg-black/75 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <span className="sr-only">{open ? "Close" : "Open"} navigation</span>
        <span className="flex w-4 flex-col gap-1.5">
          <span
            className={`block h-px w-full bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-full bg-current transition ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block h-px w-full bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          />

          <aside className="fixed left-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-black/75 p-4 pt-20 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="mb-7 px-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.28em] text-white"
              >
                WebGL Practice
              </Link>
              <p className="mt-2 text-xs leading-5 text-white/45">
                One route, one experiment, one GPU idea at a time.
              </p>
            </div>

            <nav className="space-y-6" aria-label="WebGL practices">
              {["2D", "3D"].map((group) => {
                const items = practices.filter((practice) => practice.group === group);

                return (
                  <section key={group}>
                    <h2 className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      {group}
                    </h2>

                    <div className="space-y-1">
                      {items.map((practice, index) => {
                        const href = `/practices/${practice.slug}`;
                        const active = pathname === href;

                        return (
                          <Link
                            key={practice.slug}
                            href={href}
                            prefetch={false}
                            onClick={() => setOpen(false)}
                            className={`group flex gap-3 rounded-xl px-3 py-3 transition ${active ? "bg-white/10" : "hover:bg-white/7"}`}
                          >
                            <span className={`font-mono text-[10px] ${active ? "text-white/60" : "text-white/25"}`}>
                              {String(index).padStart(2, "0")}
                            </span>

                            <span className="min-w-0">
                              <span className={`block text-sm ${active ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                                {practice.title}
                              </span>
                              <span className="mt-1 block text-[11px] leading-4 text-white/35">
                                {practice.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}
