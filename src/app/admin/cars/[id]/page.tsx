import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  carCategoryLabel,
  fuelLabel,
  transmissionLabel,
} from "@/lib/types";
import { updateCar } from "../../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const categories = ["KOMPAKT", "MELLOMKLASSE", "SUV", "ELBIL", "VAREBIL", "PREMIUM"] as const;
const fuels = ["BENSIN", "DIESEL", "HYBRID", "EL"] as const;
const transmissions = ["AUTOMAT", "MANUELL"] as const;

export default async function AdminCarEditPage(props: Props) {
  const { id } = await props.params;
  const [car, locations] = await Promise.all([
    prisma.car.findUnique({ where: { id } }),
    prisma.location.findMany({ orderBy: { city: "asc" } }),
  ]);

  if (!car) notFound();

  return (
    <div>
      <Link
        href="/admin/cars"
        className="text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-ink)]"
      >
        ← Tilbake til biler
      </Link>
      <h1 className="headline-md mt-3">
        Rediger {car.brand} {car.model}
      </h1>

      <form action={updateCar} className="mt-8 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" value={car.id} />
        <Input name="brand" label="Merke" defaultValue={car.brand} required />
        <Input name="model" label="Modell" defaultValue={car.model} required />
        <Select name="category" label="Kategori" defaultValue={car.category} options={categories.map((c) => ({ value: c, label: carCategoryLabel[c] }))} />
        <Select name="fuel" label="Drivstoff" defaultValue={car.fuel} options={fuels.map((f) => ({ value: f, label: fuelLabel[f] }))} />
        <Select name="transmission" label="Girkasse" defaultValue={car.transmission} options={transmissions.map((t) => ({ value: t, label: transmissionLabel[t] }))} />
        <Input name="seats" label="Seter" type="number" defaultValue={String(car.seats)} />
        <Input name="doors" label="Dører" type="number" defaultValue={String(car.doors)} />
        <Input name="luggage" label="Bagasje" type="number" defaultValue={String(car.luggage)} />
        <Input name="range" label="Rekkevidde" defaultValue={car.range} />
        <Input name="image" label="Bilde-URL" defaultValue={car.image} />
        <Input name="pricePerDay" label="Pris per dag (kr)" type="number" defaultValue={String(car.pricePerDay)} required />
        <Input name="pricePerMonth" label="Pris per måned (kr)" type="number" defaultValue={String(car.pricePerMonth)} required />
        <Select
          name="locationId"
          label="Lokasjon"
          defaultValue={car.locationId ?? ""}
          options={[
            { value: "", label: "— ingen —" },
            ...locations.map((l) => ({ value: l.id, label: l.city })),
          ]}
        />
        <div className="sm:col-span-2">
          <Textarea name="summary" label="Sammendrag" defaultValue={car.summary} />
        </div>
        <div className="sm:col-span-2">
          <Textarea name="features" label="Utstyr (kommaseparert)" defaultValue={car.features.join(", ")} />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white hover:bg-black"
          >
            Lagre endringer
          </button>
          <Link
            href="/admin/cars"
            className="flex h-12 items-center rounded-full border border-[color:var(--color-line)] px-5 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
          >
            Avbryt
          </Link>
        </div>
      </form>
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

function Textarea({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[color:var(--color-ink)] focus:outline-none"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
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
