export function PracticeLoading({ label = "Loading WebGL experiment..." }: { label?: string }) {
  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-neutral-950 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
      {label}
    </div>
  );
}
