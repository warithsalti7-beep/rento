import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/Button";
import { getCarBySlug } from "@/server/cars";
import { carCategoryLabel, fuelLabel, transmissionLabel } from "@/lib/types";
import { formatKrPerDay, formatKrPerMonth } from "@/lib/format";

type CarDetailProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(
  props: CarDetailProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Bil ikke funnet" };
  return {
    title: `${car.brand} ${car.model}`,
    description: car.summary,
  };
}

export default async function CarDetailPage(props: CarDetailProps) {
  const { slug } = await props.params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const specs: Array<{ label: string; value: string }> = [
    { label: "Seter", value: `${car.seats}` },
    { label: "Dører", value: `${car.doors}` },
    { label: "Girkasse", value: transmissionLabel[car.transmission] },
    { label: "Drivstoff", value: fuelLabel[car.fuel] },
    { label: "Bagasje", value: `${car.luggage} kofferter` },
    { label: "Rekkevidde", value: car.range },
  ];

  return (
    <section>
      <div className="container-x pt-10 md:pt-14">
        <nav aria-label="Brødsmuler" className="text-sm text-[color:var(--color-mute)]">
          <Link href="/cars" className="hover:text-[color:var(--color-ink)]">
            Biler
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[color:var(--color-ink)]">{car.brand} {car.model}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-[color:var(--color-fog)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div>
              <p className="text-sm text-[color:var(--color-mute)]">
                {carCategoryLabel[car.category]}
              </p>
              <h1 className="headline-lg mt-2">
                {car.brand} {car.model}
              </h1>
              <p className="mt-3 text-[color:var(--color-mute)]">{car.summary}</p>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                    Dagspris
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {formatKrPerDay(car.pricePerDay)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                    Per måned
                  </p>
                  <p className="mt-1 text-lg font-medium">
                    Fra {formatKrPerMonth(car.pricePerMonth)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[color:var(--color-mute)]">
                Forsikring, veihjelp og vedlikehold inkludert.
              </p>
              <LinkButton
                href={`/booking?car=${car.slug}`}
                size="lg"
                className="mt-6 w-full"
              >
                Bestill nå
              </LinkButton>
              <p className="mt-3 text-center text-xs text-[color:var(--color-mute)]">
                Fri avbestilling inntil 48 timer før henting
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="headline-md">Spesifikasjoner</h2>
            <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5">
              {specs.map((spec) => (
                <div key={spec.label} className="border-t border-[color:var(--color-line)] pt-3">
                  <dt className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="headline-md">Utstyr</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {car.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container-x py-20">
        <div className="rounded-3xl bg-[color:var(--color-fog)] p-10 md:p-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="headline-md">Trenger du mer tid?</h2>
              <p className="mt-2 text-[color:var(--color-mute)]">
                Bytt til månedsleie og spar opptil 30 %. Bytt bil eller si opp når du vil.
              </p>
            </div>
            <LinkButton href="/pricing" variant="secondary" size="lg">
              Se månedspriser
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
