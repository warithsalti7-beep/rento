"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileNav({
  isAdmin,
  isAuthed,
}: {
  isAdmin: boolean;
  isAuthed: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Åpne meny"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-ink)] hover:bg-[color:var(--color-fog)] md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden"
        >
          <button
            type="button"
            aria-label="Lukk meny"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 h-16">
              <span className="text-sm font-medium">Meny</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Lukk"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[color:var(--color-fog)]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5">
              <ul className="space-y-1 text-base font-medium">
                {[
                  { href: "/cars", label: "Biler" },
                  { href: "/pricing", label: "Priser" },
                  { href: "/how-it-works", label: "Slik fungerer det" },
                  { href: "/about", label: "Om Rento" },
                  { href: "/contact", label: "Kontakt" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center rounded-xl px-3 hover:bg-[color:var(--color-fog)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {isAuthed && (
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center rounded-xl px-3 hover:bg-[color:var(--color-fog)]"
                    >
                      Min side
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center rounded-xl px-3 text-[color:var(--color-accent)] hover:bg-[color:var(--color-fog)]"
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="border-t border-[color:var(--color-line)] p-5">
              {isAuthed ? (
                <p className="text-xs text-[color:var(--color-mute)]">
                  Logget inn
                </p>
              ) : (
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center rounded-full border border-[color:var(--color-line)] text-sm font-medium"
                >
                  Logg inn
                </Link>
              )}
              <Link
                href="/cars"
                onClick={() => setOpen(false)}
                className="mt-3 flex h-12 items-center justify-center rounded-full bg-[color:var(--color-ink)] text-sm font-medium text-white"
              >
                Book nå
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
