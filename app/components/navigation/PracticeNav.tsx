import Link from "next/link";
import { practices } from "@/app/data/practices";

export function PracticeNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-white/10 bg-black/70 p-5 text-white backdrop-blur-xl lg:block">
      <div className="mb-8">
        <Link href="/" className="font-mono text-sm uppercase tracking-[0.28em] text-white">
          WebGL Practice
        </Link>
        <p className="mt-2 text-xs leading-5 text-white/45">
          One route, one experiment, one GPU idea at a time.
        </p>
      </div>

      <nav className="space-y-7" aria-label="WebGL practices">
        {["2D", "3D"].map((group) => {
          const items = practices.filter((practice) => practice.group === group);

          return (
            <section key={group}>
              <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                {group}
              </h2>
              <div className="space-y-1">
                {items.map((practice, index) => (
                  <Link
                    key={practice.slug}
                    href={`/practices/${practice.slug}`}
                    className="group flex gap-3 rounded-lg px-3 py-3 transition hover:bg-white/7"
                  >
                    <span className="font-mono text-[10px] text-white/25">
                      {String(index).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-white/80 group-hover:text-white">
                        {practice.title}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-white/35">
                        {practice.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobilePracticeNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex gap-2 overflow-x-auto border-t border-white/10 bg-black/80 p-2 backdrop-blur-xl lg:hidden">
      <Link href="/" className="shrink-0 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
        Home
      </Link>
      {practices.map((practice) => (
        <Link
          key={practice.slug}
          href={`/practices/${practice.slug}`}
          className="shrink-0 rounded-md border border-white/10 px-3 py-2 text-xs text-white/70"
        >
          {practice.title}
        </Link>
      ))}
    </nav>
  );
}
