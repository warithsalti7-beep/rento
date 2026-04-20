import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { auth, signOut } from "@/lib/auth";

const nav = [
  { href: "/cars", label: "Biler" },
  { href: "/pricing", label: "Priser" },
  { href: "/how-it-works", label: "Slik fungerer det" },
  { href: "/about", label: "Om Rento" },
];

export async function Header() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAuthed = Boolean(session?.user);

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
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="text-[color:var(--color-accent)] transition-colors hover:underline"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link
                href="/account"
                className="hidden text-sm text-[color:var(--color-mute)] transition-colors hover:text-[color:var(--color-ink)] md:block"
              >
                Min side
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="hidden text-sm text-[color:var(--color-mute)] transition-colors hover:text-[color:var(--color-ink)] md:block"
                >
                  Logg ut
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="hidden text-sm text-[color:var(--color-mute)] transition-colors hover:text-[color:var(--color-ink)] md:block"
            >
              Logg inn
            </Link>
          )}
          <LinkButton href="/cars" size="md" className="hidden md:inline-flex">
            Book nå
          </LinkButton>
          <MobileNav isAdmin={isAdmin} isAuthed={isAuthed} />
        </div>
      </div>
    </header>
  );
}
