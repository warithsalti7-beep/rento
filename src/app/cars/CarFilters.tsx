"use client";

import { useMemo, useState } from "react";
import type { Car, CarCategory } from "@/data/cars";
import { categories } from "@/data/cars";
import { CarCard } from "@/components/CarCard";

type SortKey = "price-asc" | "price-desc" | "recommended";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "recommended", label: "Anbefalt" },
  { value: "price-asc", label: "Pris: lav til høy" },
  { value: "price-desc", label: "Pris: høy til lav" },
];

export function CarFilters({ cars }: { cars: Car[] }) {
  const [selected, setSelected] = useState<CarCategory | "alle">("alle");
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    const list = selected === "alle" ? cars : cars.filter((c) => c.category === selected);
    if (sort === "price-asc") return [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") return [...list].sort((a, b) => b.pricePerDay - a.pricePerDay);
    return list;
  }, [cars, selected, sort]);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={selected === "alle"}
            onClick={() => setSelected("alle")}
          >
            Alle
          </FilterPill>
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              active={selected === cat}
              onClick={() => setSelected(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-mute)]">
          Sorter
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-[color:var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-[color:var(--color-mute)]">
        {filtered.length} {filtered.length === 1 ? "bil" : "biler"} tilgjengelig
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((car) => (
          <CarCard key={car.slug} car={car} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
          Ingen biler i denne kategorien akkurat nå.
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-[color:var(--color-ink)] px-4 py-2 text-sm font-medium text-white"
          : "rounded-full border border-[color:var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)]"
      }
    >
      {children}
    </button>
  );
}
