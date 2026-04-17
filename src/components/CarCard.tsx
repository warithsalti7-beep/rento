import Link from "next/link";
import type { CarListItem } from "@/lib/types";
import {
  carCategoryLabel,
  fuelLabel,
  transmissionLabel,
} from "@/lib/types";
import { formatKrPerDay, formatKrPerMonth } from "@/lib/format";

export function CarCard({ car }: { car: CarListItem }) {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(15,15,15,0.2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-fog)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[color:var(--color-ink)]">
          {carCategoryLabel[car.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <p className="text-xs text-[color:var(--color-mute)]">{car.brand}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            {car.model}
          </h3>
          <p className="mt-2 text-sm text-[color:var(--color-mute)]">
            {car.seats} seter · {transmissionLabel[car.transmission]} · {fuelLabel[car.fuel]}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-ink)]">
              {formatKrPerDay(car.pricePerDay)}
            </p>
            <p className="text-xs text-[color:var(--color-mute)]">
              Fra {formatKrPerMonth(car.pricePerMonth)}
            </p>
          </div>
          <span className="text-sm font-medium text-[color:var(--color-accent)] group-hover:underline">
            Se bil →
          </span>
        </div>
      </div>
    </Link>
  );
}
