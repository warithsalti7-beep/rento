import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { auth } from "@/lib/auth";
import { getBookingsForUser } from "@/server/bookings";
import { formatDate, formatKr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Min side",
  description: "Se og administrer dine bestillinger.",
};

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "Venter",
  CONFIRMED: "Bekreftet",
  PAID: "Betalt",
  CANCELLED: "Kansellert",
  COMPLETED: "Fullført",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <section>
        <div className="container-x pt-14 pb-20 md:pt-20">
          <p className="eyebrow">Min side</p>
          <h1 className="headline-lg mt-3">Logg inn for å se bestillingene</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
            Vi sender deg en lenke på e-post. Ingen passord å huske.
          </p>
          <div className="mt-8">
            <LinkButton href="/auth/sign-in" size="lg">
              Logg inn
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  const bookings = await getBookingsForUser(session.user.id);

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Min side</p>
        <h1 className="headline-lg mt-3">
          Velkommen{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Se og administrer bestillingene dine. Forleng, endre eller book ny bil.
        </p>
      </div>

      <div className="container-x pb-20">
        <div className="mt-6 flex items-center justify-between">
          <h2 className="headline-md">Mine bestillinger</h2>
          <LinkButton href="/cars">Ny bestilling</LinkButton>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
            Du har ingen bestillinger ennå.
          </div>
        ) : (
          <ul className="mt-8 grid gap-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-line)] bg-white p-5 md:flex-row md:items-center"
              >
                <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.car.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold">
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--color-accent)]">
                      {statusLabel[booking.status] ?? booking.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                    {booking.pickupLocation.city} · {formatDate(booking.pickupAt)} –{" "}
                    {formatDate(booking.dropoffAt)}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--color-mute)]">
                    Referanse: {booking.reference}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <p className="text-base font-semibold">{formatKr(booking.total)}</p>
                  <Link
                    href={`/cars/${booking.car.slug}`}
                    className="text-sm font-medium text-[color:var(--color-ink)] underline-offset-4 hover:underline"
                  >
                    Se detaljer →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
