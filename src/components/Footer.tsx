import Link from "next/link";
import { Logo } from "@/components/Logo";

const columns: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "Produkt",
    links: [
      { href: "/cars", label: "Bilutvalg" },
      { href: "/pricing", label: "Priser" },
      { href: "/how-it-works", label: "Slik fungerer det" },
    ],
  },
  {
    heading: "Rento",
    links: [
      { href: "/about", label: "Om oss" },
      { href: "/contact", label: "Kontakt" },
      { href: "/account", label: "Min side" },
    ],
  },
  {
    heading: "Hjelp",
    links: [
      { href: "/contact", label: "Kundeservice" },
      { href: "/how-it-works#faq", label: "Vanlige spørsmål" },
      { href: "/vilkar", label: "Vilkår" },
      { href: "/personvern", label: "Personvern" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--color-line)] bg-[color:var(--color-paper)]">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-[color:var(--color-mute)]">
              Rento gjør det enkelt å leie bil i Norge. Book på sekunder, og vi leverer bilen til deg.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-medium text-[color:var(--color-ink)]">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-mute)]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-[color:var(--color-ink)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-line)] pt-6 text-xs text-[color:var(--color-mute)] md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Rento AS
            {process.env.NEXT_PUBLIC_ORG_NUMBER
              ? ` · Org.nr. ${process.env.NEXT_PUBLIC_ORG_NUMBER}`
              : ""}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              {process.env.VIPPS_CLIENT_ID ? "Vipps · " : ""}Visa · Mastercard
            </span>
            {process.env.BANKID_ENABLED === "true" && (
              <>
                <span aria-hidden>·</span>
                <span>BankID-verifisert</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>Laget i Norge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
