import Link from "next/link";
import { formatKrPerDay } from "@/lib/format";

export function StickyMobileCTA({
  href,
  pricePerDay,
}: {
  href: string;
  pricePerDay: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--color-line)] bg-white/95 backdrop-blur md:hidden">
      <div className="container-x flex items-center justify-between gap-3 py-3">
        <div>
          <p className="text-xs text-[color:var(--color-mute)]">Fra</p>
          <p className="text-base font-semibold">
            {formatKrPerDay(pricePerDay)}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[color:var(--color-ink)] px-6 text-sm font-medium text-white"
        >
          Bestill nå
        </Link>
      </div>
      <p className="pb-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
