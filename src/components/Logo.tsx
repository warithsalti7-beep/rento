import Link from "next/link";

export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const color =
    tone === "paper"
      ? "text-white"
      : "text-[color:var(--color-ink)]";
  return (
    <Link href="/" className={className} aria-label="rento – til forsiden">
      <span
        className={`inline-flex items-baseline gap-0.5 text-[22px] font-semibold lowercase tracking-tight ${color}`}
      >
        rento
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[color:var(--color-accent)]"
        />
      </span>
    </Link>
  );
}
