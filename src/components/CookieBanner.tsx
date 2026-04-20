"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "rento.cookies.v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept(level: "necessary" | "all") {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ level, at: new Date().toISOString() }),
      );
    } catch {}
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:inset-x-auto md:right-5 md:bottom-5 md:max-w-md">
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-5 shadow-[0_20px_40px_-20px_rgba(15,15,15,0.25)]">
        <p className="text-sm font-semibold">Vi bruker informasjonskapsler</p>
        <p className="mt-2 text-sm text-[color:var(--color-mute)]">
          Nødvendige cookies brukes for å holde deg innlogget. Vi ber om
          samtykke før vi setter analyse- eller markedsføringscookies.{" "}
          <Link href="/personvern" className="underline">
            Les mer
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => accept("necessary")}
            className="h-10 rounded-full border border-[color:var(--color-line)] bg-white px-4 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
          >
            Kun nødvendige
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="h-10 rounded-full bg-[color:var(--color-ink)] px-5 text-sm font-medium text-white hover:bg-black"
          >
            Godta alle
          </button>
        </div>
      </div>
    </div>
  );
}
