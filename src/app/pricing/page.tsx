import type { Metadata } from "next";
import { LinkButton } from "@/components/Button";
import { getPricingTiers } from "@/server/pricing";
import { formatKrPerMonth } from "@/lib/format";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Velg mellom Standard, Plus og Premium. Månedspriser med alt inkludert.",
};

export const revalidate = 300;

const faqs = [
  {
    q: "Hva er inkludert i prisen?",
    a: "Forsikring, veihjelp, vedlikehold, dekkskift og grunnpakke med kilometer. Drivstoff betaler du selv.",
  },
  {
    q: "Kan jeg bytte bil underveis?",
    a: "Ja, med Plus og Premium kan du bytte bil i løpet av månedsperioden. Kontakt kundeservice.",
  },
  {
    q: "Binder jeg meg?",
    a: "Nei. Rento er fleksibelt — si opp når du vil, med 30 dagers varsel.",
  },
  {
    q: "Hva skjer ved skade?",
    a: "Egenandelen avhenger av valgt abonnement. Premium har ingen egenandel.",
  },
];

export default async function PricingPage() {
  const pricingTiers = await getPricingTiers();

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Priser</p>
        <h1 className="headline-lg mt-3">Enkle, faste månedspriser</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Én pris inkludert forsikring, vedlikehold og veihjelp. Ingen bindingstid — si opp når du vil.
        </p>
      </div>

      <div className="container-x py-10">
        <div className="grid gap-6 lg:grid-cols-3">
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
                <h2 className="text-xl font-semibold tracking-tight">
                  {tier.name}
                </h2>
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
                        tier.highlight ? "bg-white" : "bg-[color:var(--color-accent)]"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <LinkButton
                href="/cars"
                variant={tier.highlight ? "secondary" : "primary"}
                className="mt-auto"
              >
                Kom i gang
              </LinkButton>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow">Ofte stilte spørsmål</p>
            <h2 className="headline-md mt-3">Alt du lurer på</h2>
          </div>
          <div className="divide-y divide-[color:var(--color-line)] border-t border-b border-[color:var(--color-line)]">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">
                  {faq.q}
                  <span className="text-[color:var(--color-mute)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[color:var(--color-mute)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
