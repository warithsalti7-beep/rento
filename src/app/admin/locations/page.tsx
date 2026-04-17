import { prisma } from "@/lib/prisma";
import { createLocation, toggleLocation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { city: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="headline-md">Lokasjoner</h1>
      </div>

      <details className="mt-6 rounded-2xl border border-[color:var(--color-line)] p-5">
        <summary className="cursor-pointer text-sm font-medium">
          Legg til ny lokasjon
        </summary>
        <form action={createLocation} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
              By
            </span>
            <input
              name="city"
              required
              className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
              Slug (valgfritt)
            </span>
            <input
              name="slug"
              className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
              Adresse
            </span>
            <input
              name="address"
              className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
              Åpningstider
            </span>
            <input
              name="hours"
              className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <button className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white hover:bg-black">
              Opprett lokasjon
            </button>
          </div>
        </form>
      </details>

      <ul className="mt-8 divide-y divide-[color:var(--color-line)]">
        {locations.map((loc) => (
          <li
            key={loc.id}
            className="flex flex-wrap items-center justify-between gap-3 py-4"
          >
            <div>
              <p className="text-sm font-semibold">{loc.city}</p>
              <p className="text-xs text-[color:var(--color-mute)]">
                {loc.address} · {loc.hours}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await toggleLocation(loc.id, !loc.active);
              }}
            >
              <button className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-xs hover:border-[color:var(--color-ink)]">
                {loc.active ? "Deaktiver" : "Aktiver"}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
