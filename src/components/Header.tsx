import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/cars", label: "Biler" },
  { href: "/pricing", label: "Priser" },
  { href: "/how-it-works", label: "Slik fungerer det" },
  { href: "/about", label: "Om Rento" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Hovedmeny" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-[color:var(--color-ink)]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[color:var(--color-mute)] transition-colors hover:text-[color:var(--color-ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="hidden text-sm text-[color:var(--color-mute)] transition-colors hover:text-[color:var(--color-ink)] sm:block"
          >
            Logg inn
          </Link>
          <LinkButton href="/cars" size="md">
            Book nå
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
