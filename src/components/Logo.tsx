import Link from "next/link";

export function Logo({
  className,
  tone = "ink",
  size = "md",
}: {
  className?: string;
  tone?: "ink" | "paper";
  size?: "sm" | "md" | "lg";
}) {
  const textColor =
    tone === "paper" ? "text-white" : "text-[color:var(--color-ink)]";
  const dotColor =
    tone === "paper" ? "bg-white" : "bg-[color:var(--color-accent)]";

  const sizeMap = {
    sm: { text: "text-[17px]", dot: "h-[5px] w-[5px] ml-[3px] mb-[2px]" },
    md: { text: "text-[22px]", dot: "h-[6px] w-[6px] ml-[4px] mb-[3px]" },
    lg: { text: "text-[32px]", dot: "h-[9px] w-[9px] ml-[5px] mb-[5px]" },
  };
  const s = sizeMap[size];

  return (
    <Link href="/" className={className} aria-label="rento – til forsiden">
      <span
        className={`inline-flex items-end font-semibold lowercase tracking-[-0.03em] ${s.text} ${textColor}`}
      >
        rento
        <span
          aria-hidden
          className={`inline-block rounded-full ${s.dot} ${dotColor}`}
        />
      </span>
    </Link>
  );
}
