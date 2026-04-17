const items = [
  { label: "Forsikring inkludert" },
  { label: "Betal med Vipps og kort" },
  { label: "BankID-verifisert" },
  { label: "Fri avbestilling 48 t" },
];

export function TrustRow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dotClass =
    tone === "dark" ? "bg-white/70" : "bg-[color:var(--color-accent)]";
  const textClass =
    tone === "dark" ? "text-white/80" : "text-[color:var(--color-mute)]";

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
