import type { Metadata } from "next";
import { LinkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Slik fungerer det",
  description: "Fra booking til levering — slik fungerer Rento.",
};

const timeline = [
  {
    title: "Book på nett",
    body: "Velg bil, sted og datoer. Alt gjøres på under ett minutt fra mobil eller web.",
  },
  {
    title: "Verifisering",
    body: "Last opp førerkort og legitimasjon. Vi godkjenner automatisk i løpet av minutter.",
  },
  {
    title: "Vi leverer",
    body: "Bilen kjøres til deg på avtalt sted — hjemme, på jobb eller flyplassen.",
  },
  {
    title: "Kjør i vei",
    body: "Start turen. Bilen er fulltanket, ren og klar. Veihjelp og forsikring er inkludert.",
  },
  {
    title: "Vi henter",
    body: "Når perioden er over, henter vi bilen samme sted. Ingen kø, ingen skjemaer.",
  },
];

const faqs = [
  {
    q: "Hvor kan jeg hente og levere?",
    a: "Oslo, Bergen, Trondheim, Stavanger og Tromsø. Gratis levering i Oslo og Bergen, ellers avhengig av avstand.",
  },
  {
    q: "Trenger jeg kredittkort?",
    a: "Nei, men vi reserverer en depositum via Vipps eller kort ved henting. Beløpet frigjøres etter levering.",
  },
  {
    q: "Kan jeg forlenge leien?",
    a: "Ja, du kan forlenge direkte i appen når du vil, så lenge bilen er ledig.",
  },
  {
    q: "Hva med drivstoff eller lading?",
    a: "Du leverer bilen tilbake med samme mengde drivstoff eller lading som ved henting.",
  },
];

export default function HowItWorksPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Slik fungerer det</p>
        <h1 className="headline-lg mt-3">Enkel bilutleie, fra start til slutt</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Rento er designet for å fjerne alt som tar tid. Alt foregår digitalt, og bilen leveres der du er.
        </p>
      </div>

      <div className="container-x py-10">
        <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {timeline.map((item, idx) => (
            <li key={item.title} className="relative">
              <span className="text-sm font-medium text-[color:var(--color-mute)]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-mute)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div id="faq" className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow">Spørsmål og svar</p>
            <h2 className="headline-md mt-3">Vanlige spørsmål</h2>
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
                <p className="mt-3 text-sm text-[color:var(--color-mute)]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pb-20">
        <div className="rounded-3xl bg-[color:var(--color-ink)] p-10 text-white md:p-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="headline-md">Klar til første tur?</h2>
              <p className="mt-2 text-white/75">
                Se hvilke biler som er tilgjengelige i dag.
              </p>
            </div>
            <LinkButton href="/cars" variant="secondary" size="lg">
              Se biler
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
