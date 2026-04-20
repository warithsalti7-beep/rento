"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LocationListItem } from "@/lib/types";

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function SearchBar({ locations }: { locations: LocationListItem[] }) {
  const router = useRouter();
  const fallback = locations[0]?.slug ?? "";
  const [location, setLocation] = useState(fallback);
  const [pickup, setPickup] = useState(todayPlus(1));
  const [dropoff, setDropoff] = useState(todayPlus(4));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ location, pickup, dropoff });
    router.push(`/booking?${params.toString()}&step=2`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white shadow-[0_24px_50px_-28px_rgba(15,15,15,0.25)] sm:grid-cols-[1.2fr_1fr_1fr_auto]"
    >
      <label className="flex flex-col gap-1 border-b border-[color:var(--color-line)] px-5 py-3 sm:border-b-0 sm:border-r">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
          Hentested
        </span>
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="bg-transparent text-sm font-medium text-[color:var(--color-ink)] focus:outline-none"
        >
          {locations.map((loc) => (
            <option key={loc.slug} value={loc.slug}>
              {loc.city}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 border-b border-[color:var(--color-line)] px-5 py-3 sm:border-b-0 sm:border-r">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
          Hentedato
        </span>
        <input
          type="date"
          value={pickup}
          onChange={(event) => setPickup(event.target.value)}
          className="bg-transparent text-sm font-medium text-[color:var(--color-ink)] focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 px-5 py-3 sm:border-r sm:border-[color:var(--color-line)]">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
          Leveringsdato
        </span>
        <input
          type="date"
          value={dropoff}
          onChange={(event) => setDropoff(event.target.value)}
          className="bg-transparent text-sm font-medium text-[color:var(--color-ink)] focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="h-14 bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black sm:h-auto"
      >
        Søk biler
      </button>
    </form>
  );
}
