import { prisma } from "@/lib/prisma";
import { carCategoryLabel, fuelLabel, transmissionLabel } from "@/lib/types";
import { formatKrPerDay } from "@/lib/format";
import { createCar, updateCarStatus, deleteCar } from "../actions";

export const dynamic = "force-dynamic";

const categories = ["KOMPAKT", "MELLOMKLASSE", "SUV", "ELBIL", "VAREBIL", "PREMIUM"] as const;
const fuels = ["BENSIN", "DIESEL", "HYBRID", "EL"] as const;
const transmissions = ["AUTOMAT", "MANUELL"] as const;

export default async function AdminCarsPage() {
  const [cars, locations] = await Promise.all([
    prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: { location: true },
    }),
    prisma.location.findMany({ orderBy: { city: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="headline-md">Biler</h1>
        <p className="text-sm text-[color:var(--color-mute)]">{cars.length} totalt</p>
      </div>

      <details className="mt-6 rounded-2xl border border-[color:var(--color-line)] p-5">
        <summary className="cursor-pointer text-sm font-medium">Legg til ny bil</summary>
        <form action={createCar} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input name="brand" label="Merke" required />
          <Input name="model" label="Modell" required />
          <Input name="slug" label="Slug (valgfritt)" />
          <Select name="category" label="Kategori" options={categories.map((c) => ({ value: c, label: carCategoryLabel[c] }))} />
          <Select name="fuel" label="Drivstoff" options={fuels.map((f) => ({ value: f, label: fuelLabel[f] }))} />
          <Select name="transmission" label="Girkasse" options={transmissions.map((t) => ({ value: t, label: transmissionLabel[t] }))} />
          <Input name="seats" label="Seter" type="number" defaultValue="5" />
          <Input name="doors" label="Dører" type="number" defaultValue="5" />
          <Input name="luggage" label="Bagasje" type="number" defaultValue="2" />
          <Input name="range" label="Rekkevidde" />
          <Input name="image" label="Bilde-URL" />
          <Input name="pricePerDay" label="Pris per dag (kr)" type="number" required />
          <Input name="pricePerMonth" label="Pris per måned (kr)" type="number" required />
          <Select
            name="locationId"
            label="Lokasjon"
            options={[
              { value: "", label: "— ingen —" },
              ...locations.map((l) => ({ value: l.id, label: l.city })),
            ]}
          />
          <div className="sm:col-span-2">
            <Textarea name="summary" label="Sammendrag" />
          </div>
          <div className="sm:col-span-2">
            <Textarea name="features" label="Utstyr (kommaseparert)" />
          </div>
          <div className="sm:col-span-2">
            <button className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white hover:bg-black">
              Opprett bil
            </button>
          </div>
        </form>
      </details>

      <ul className="mt-8 divide-y divide-[color:var(--color-line)]">
        {cars.map((car) => (
          <li key={car.id} className="flex items-center gap-4 py-4">
            <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={car.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {car.brand} {car.model}
              </p>
              <p className="text-xs text-[color:var(--color-mute)]">
                {carCategoryLabel[car.category]} · {car.location?.city ?? "ingen lokasjon"} ·{" "}
                {formatKrPerDay(car.pricePerDay)} · {car.status}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await updateCarStatus(
                  car.id,
                  car.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE",
                );
              }}
            >
              <button className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-xs hover:border-[color:var(--color-ink)]">
                {car.status === "ACTIVE" ? "Sett i vedlikehold" : "Sett aktiv"}
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await deleteCar(car.id);
              }}
            >
              <button className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-700 hover:border-red-400">
                Arkiver
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm focus:border-[color:var(--color-ink)] focus:outline-none"
      />
    </label>
  );
}

function Textarea({ name, label }: { name: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      <textarea
        name={name}
        rows={3}
        className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[color:var(--color-ink)] focus:outline-none"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      <select
        name={name}
        className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm focus:border-[color:var(--color-ink)] focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
