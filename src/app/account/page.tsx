import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { cars } from "@/data/cars";
import { formatDate, formatKr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Min side",
  description: "Se og administrer dine bestillinger.",
};

const demoBookings = [
  {
    reference: "RE-X9P2Q",
    carSlug: cars[0].slug,
    status: "Aktiv",
    pickup: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    dropoff: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    total: cars[0].pricePerDay * 5,
    location: "Oslo sentrum",
  },
  {
    reference: "RE-K44LT",
    carSlug: cars[2].slug,
    status: "Fullført",
    pickup: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    dropoff: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    total: cars[2].pricePerDay * 5,
    location: "Bergen",
  },
];

export default function AccountPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Min side</p>
        <h1 className="headline-lg mt-3">Velkommen tilbake</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Se og administrer bestillingene dine. Forleng, endre eller book ny bil.
        </p>
      </div>

      <div className="container-x pb-20">
        <div className="mt-6 flex items-center justify-between">
          <h2 className="headline-md">Mine bestillinger</h2>
          <LinkButton href="/cars">Ny bestilling</LinkButton>
        </div>

        <ul className="mt-8 grid gap-4">
          {demoBookings.map((booking) => {
            const car = cars.find((c) => c.slug === booking.carSlug);
            if (!car) return null;
            return (
              <li
                key={booking.reference}
                className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-line)] bg-white p-5 md:flex-row md:items-center"
              >
                <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold">
                      {car.brand} {car.model}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "Aktiv"
                          ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                          : "bg-[color:var(--color-fog)] text-[color:var(--color-mute)]"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                    {booking.location} · {formatDate(booking.pickup)} –{" "}
                    {formatDate(booking.dropoff)}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--color-mute)]">
                    Referanse: {booking.reference}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <p className="text-base font-semibold">
                    {formatKr(booking.total)}
                  </p>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="text-sm font-medium text-[color:var(--color-ink)] underline-offset-4 hover:underline"
                  >
                    Se detaljer →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 rounded-2xl bg-[color:var(--color-fog)] p-6 text-sm text-[color:var(--color-mute)]">
          Dette er en demo-konto. Full innlogging kommer snart.
        </div>
      </div>
    </section>
  );
}
