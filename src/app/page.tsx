import Link from "next/link";
import { CarCard } from "@/components/CarCard";
import { LinkButton } from "@/components/Button";
import { SearchBar } from "@/components/SearchBar";
import { cars } from "@/data/cars";
import { pricingTiers } from "@/data/pricing";
import { formatKrPerMonth } from "@/lib/format";

const steps = [
  {
    number: "01",
    title: "Velg bil",
    body: "Bla gjennom utvalget vårt — fra elbil til varebil. Gjennomsiktige priser, ingen overraskelser.",
  },
  {
    number: "02",
    title: "Velg dato",
    body: "Plukk hentedato, leveringsdato og sted. Book på under ett minutt.",
  },
  {
    number: "03",
    title: "Vi leverer",
    body: "Kjør i vei. Vi leverer bilen til døren, klar til bruk, fulltanket og vasket.",
  },
];

const trust = [
  {
    title: "Gjennomsiktige priser",
    body: "Én pris inkludert forsikring, veihjelp og vedlikehold. Ingen skjulte gebyrer.",
  },
  {
    title: "Levert til døren",
    body: "Vi henter og leverer bilen der du er — hjemme, på jobb eller på flyplassen.",
  },
  {
    title: "Nye biler",
    body: "Moderne flåte med lavt utslipp. Elbiler, hybrider og varebiler.",
  },
  {
    title: "Fleksibel leie",
    body: "Fra én dag til flere måneder. Si opp når du vil, med 30 dagers varsel.",
  },
];

export default function HomePage() {
  const featured = cars.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x pt-14 pb-10 md:pt-20 md:pb-16">
          <p className="eyebrow">Bilutleie i Norge</p>
          <h1 className="headline-xl mt-4 max-w-3xl">
            Lei bil. Enkelt.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[color:var(--color-mute)] md:text-xl">
            Book på sekunder. Vi leverer til deg.
          </p>
          <div className="mt-10">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--color-mute)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
              Gratis levering i Oslo og Bergen
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
              Forsikring og veihjelp inkludert
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
              Fri avbestilling inntil 48 t
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--color-line)] bg-[color:var(--color-fog)]">
        <div className="container-x py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Slik fungerer det</p>
              <h2 className="headline-lg mt-3">Så enkelt fungerer det</h2>
            </div>
            <p className="max-w-md text-[color:var(--color-mute)]">
              Tre steg fra start til rattet. Alt håndteres digitalt — ingen skjemaer, ingen kø.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl border border-[color:var(--color-line)] bg-white p-7"
              >
                <span className="text-sm font-medium text-[color:var(--color-mute)]">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-[color:var(--color-mute)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="container-x py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Bilutvalg</p>
              <h2 className="headline-lg mt-3">Populære biler nå</h2>
            </div>
            <Link
              href="/cars"
              className="text-sm font-medium text-[color:var(--color-ink)] underline-offset-4 hover:underline"
            >
              Se alle biler →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--color-line)] bg-[color:var(--color-fog)]">
        <div className="container-x py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Priser</p>
              <h2 className="headline-lg mt-3">Månedsleie med alt inkludert</h2>
            </div>
            <p className="max-w-md text-[color:var(--color-mute)]">
              Velg et abonnement som passer kjørebehovet ditt. Bytt, pause eller si opp når du vil.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`flex flex-col gap-6 rounded-2xl border p-8 ${
                  tier.highlight
                    ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                    : "border-[color:var(--color-line)] bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {tier.name}
                  </h3>
                  {tier.highlight && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                      Mest valgt
                    </span>
                  )}
                </div>
                <p
                  className={
                    tier.highlight
                      ? "text-sm text-white/70"
                      : "text-sm text-[color:var(--color-mute)]"
                  }
                >
                  {tier.tagline}
                </p>
                <div>
                  <p
                    className={
                      tier.highlight
                        ? "text-xs uppercase tracking-wider text-white/60"
                        : "text-xs uppercase tracking-wider text-[color:var(--color-mute)]"
                    }
                  >
                    Fra
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {formatKrPerMonth(tier.priceFromMonth)}
                  </p>
                </div>
                <ul
                  className={`space-y-3 text-sm ${
                    tier.highlight ? "text-white/85" : "text-[color:var(--color-ink)]"
                  }`}
                >
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className={`mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                          tier.highlight
                            ? "bg-white"
                            : "bg-[color:var(--color-accent)]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <LinkButton
                  href={`/pricing?tier=${tier.id}`}
                  variant={tier.highlight ? "secondary" : "primary"}
                  className="mt-auto"
                >
                  Velg {tier.name}
                </LinkButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Derfor Rento</p>
            <h2 className="headline-lg mt-3">Derfor velger folk Rento</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {trust.map((item) => (
              <div key={item.title}>
                <h3 className="headline-md">{item.title}</h3>
                <p className="mt-3 text-[color:var(--color-mute)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--color-line)] bg-[color:var(--color-ink)] text-white">
        <div className="container-x flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="headline-lg">Klar til å kjøre?</h2>
            <p className="mt-4 text-white/75">
              Book en bil på under ett minutt. Vi tar oss av resten — forsikring, veihjelp og levering.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/cars" variant="secondary" size="lg">
              Se biler
            </LinkButton>
            <LinkButton href="/how-it-works" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Slik fungerer det
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
