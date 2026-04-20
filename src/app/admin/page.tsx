import { prisma } from "@/lib/prisma";
import { formatKr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [cars, locations, bookings, pendingBookings, revenue] = await Promise.all([
    prisma.car.count({ where: { status: "ACTIVE" } }),
    prisma.location.count({ where: { active: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "COMPLETED"] } },
    }),
  ]);

  const stats = [
    { label: "Aktive biler", value: cars },
    { label: "Lokasjoner", value: locations },
    { label: "Bestillinger totalt", value: bookings },
    { label: "Venter på betaling", value: pendingBookings },
    {
      label: "Omsetning",
      value: formatKr(revenue._sum.total ?? 0),
    },
  ];

  return (
    <div>
      <h1 className="headline-md">Oversikt</h1>
      <p className="mt-2 text-[color:var(--color-mute)]">
        Nøkkeltall for driften. Oppdateres live fra databasen.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-fog)] p-5"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
