import type { Metadata } from "next";
import { LinkButton } from "@/components/Button";
import { getBookingByReference } from "@/server/bookings";
import { formatDate, formatKr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bekreftelse",
};

type ConfirmationProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ConfirmationPage(props: ConfirmationProps) {
  const params = await props.searchParams;
  const reference =
    typeof params?.reference === "string" ? params.reference : undefined;

  const booking = reference ? await getBookingByReference(reference) : null;
  const paid = booking?.status === "PAID" || booking?.status === "CONFIRMED";
  const pending = booking?.status === "PENDING";

  const heading = paid
    ? "Bestilling bekreftet"
    : pending
      ? "Bestilling mottatt"
      : "Bestilling bekreftet";
  const subhead = paid
    ? "Vi har sendt bekreftelsen på e-post."
    : pending
      ? "Vi bekrefter betalingen innen et par minutter og sender deg en e-post så snart den er på plass."
      : "Vi har sendt bekreftelsen på e-post.";

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h1 className="headline-lg mt-5">{heading}</h1>
          <p className="mt-3 text-[color:var(--color-mute)]">
            Takk
            {booking?.guestName ? `, ${booking.guestName.split(" ")[0]}` : ""}.
            {" "}
            {subhead}
          </p>

          {booking ? (
            <dl className="mt-10 divide-y divide-[color:var(--color-line)] rounded-2xl border border-[color:var(--color-line)] bg-white">
              <Row label="Bestillingsnummer" value={booking.reference} />
              <Row
                label="Bil"
                value={`${booking.car.brand} ${booking.car.model}`}
              />
              <Row label="Hentested" value={booking.pickupLocation.city} />
              <Row
                label="Hentedato"
                value={formatDate(booking.pickupAt)}
              />
              <Row
                label="Levering"
                value={formatDate(booking.dropoffAt)}
              />
              <Row
                label="Varighet"
                value={`${booking.days} ${booking.days === 1 ? "dag" : "dager"}`}
              />
              <Row label="Totalt" value={formatKr(booking.total)} strong />
            </dl>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-6 text-sm text-[color:var(--color-mute)]">
              Finner ingen bestilling med denne referansen.
            </p>
          )}

          <div className="mt-10 rounded-2xl bg-[color:var(--color-fog)] p-6 text-sm text-[color:var(--color-mute)]">
            <p>Neste steg:</p>
            <ul className="mt-3 space-y-2">
              <li>• Vi leverer bilen til avtalt sted og tid.</li>
              <li>• Du får en SMS 30 minutter før levering.</li>
              <li>• Betaling trekkes først når bilen er hentet.</li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <LinkButton href="/account" size="lg">
              Se min bestilling
            </LinkButton>
            <LinkButton href="/" variant="secondary" size="lg">
              Tilbake til forsiden
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <dt className="text-sm text-[color:var(--color-mute)]">{label}</dt>
      <dd
        className={
          strong
            ? "text-base font-semibold text-[color:var(--color-ink)]"
            : "text-sm font-medium text-[color:var(--color-ink)]"
        }
      >
        {value}
      </dd>
    </div>
  );
}
