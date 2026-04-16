import type { Metadata } from "next";
import { LinkButton } from "@/components/Button";
import { findCar } from "@/data/cars";
import { locations } from "@/data/locations";
import { formatKr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bekreftelse",
};

function bookingReference() {
  return `RE-${Math.random().toString(36).slice(2, 7).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
}

export default async function ConfirmationPage(
  props: PageProps<"/booking/confirmation">,
) {
  const params = await props.searchParams;
  const carSlug = typeof params?.car === "string" ? params.car : undefined;
  const locationSlug = typeof params?.location === "string" ? params.location : undefined;
  const pickup = typeof params?.pickup === "string" ? params.pickup : "";
  const dropoff = typeof params?.dropoff === "string" ? params.dropoff : "";
  const days = typeof params?.days === "string" ? params.days : "";
  const total = typeof params?.total === "string" ? Number(params.total) : 0;
  const name = typeof params?.name === "string" ? params.name : "";

  const car = carSlug ? findCar(carSlug) : undefined;
  const loc = locations.find((l) => l.slug === locationSlug);
  const reference = bookingReference();

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]">
            ✓
          </span>
          <h1 className="headline-lg mt-5">Bestilling bekreftet</h1>
          <p className="mt-3 text-[color:var(--color-mute)]">
            Takk{name ? `, ${name.split(" ")[0]}` : ""}. Vi har sendt bekreftelsen på e-post.
          </p>

          <dl className="mt-10 divide-y divide-[color:var(--color-line)] rounded-2xl border border-[color:var(--color-line)] bg-white">
            <Row label="Bestillingsnummer" value={reference} />
            {car && <Row label="Bil" value={`${car.brand} ${car.model}`} />}
            {loc && <Row label="Hentested" value={loc.city} />}
            {pickup && <Row label="Hentedato" value={pickup} />}
            {dropoff && <Row label="Levering" value={dropoff} />}
            {days && <Row label="Varighet" value={`${days} ${days === "1" ? "dag" : "dager"}`} />}
            {total > 0 && <Row label="Totalt" value={formatKr(total)} strong />}
          </dl>

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
