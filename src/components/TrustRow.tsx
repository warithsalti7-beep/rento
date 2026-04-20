const baseItems = [
  { label: "Forsikring inkludert", flag: "always" },
  { label: "Fri avbestilling 48 t", flag: "always" },
] as const;

type TrustItem = { label: string; flag: string };

function resolveItems(): TrustItem[] {
  const items: TrustItem[] = [...baseItems];

  if (process.env.VIPPS_CLIENT_ID) {
    items.push({ label: "Betal med Vipps og kort", flag: "vipps" });
  } else if (process.env.STRIPE_SECRET_KEY) {
    items.push({ label: "Sikker kortbetaling", flag: "stripe" });
  }

  if (process.env.BANKID_ENABLED === "true") {
    items.push({ label: "BankID-verifisert", flag: "bankid" });
  }

  return items;
}

export function TrustRow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dotClass =
    tone === "dark" ? "bg-white/70" : "bg-[color:var(--color-accent)]";
  const textClass =
    tone === "dark" ? "text-white/80" : "text-[color:var(--color-mute)]";

  const items = resolveItems();

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${textClass}`}
    >
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
