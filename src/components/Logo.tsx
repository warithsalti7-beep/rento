import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={className}
      aria-label="Rento – til forsiden"
    >
      <span className="inline-flex items-center gap-2 text-[color:var(--color-ink)]">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-ink)] text-white text-[13px] font-semibold tracking-tight"
        >
          R
        </span>
        <span className="text-[19px] font-semibold tracking-tight">Rento</span>
      </span>
    </Link>
  );
}
