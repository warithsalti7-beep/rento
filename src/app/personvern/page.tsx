import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvern",
  description: "Slik behandler Rento dine personopplysninger.",
};

export default function PersonvernPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-20 md:pt-20">
        <p className="eyebrow">Personvern</p>
        <h1 className="headline-lg mt-3">Personvernerklæring</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Sist oppdatert: 17. april 2026.
        </p>

        <div className="mt-12 max-w-2xl space-y-10 text-[color:var(--color-ink)]">
          <Section title="Behandlingsansvarlig">
            Rento AS er behandlingsansvarlig for personopplysningene du gir oss
            når du bruker rentobil.no.
          </Section>

          <Section title="Hvilke opplysninger vi samler inn">
            Vi samler inn navn, e-post, telefonnummer, førerkort, ID, og
            bookinghistorikk. Vi benytter også informasjonskapsler for
            grunnleggende nettstedsfunksjonalitet.
          </Section>

          <Section title="Hvorfor vi behandler opplysningene">
            Vi behandler opplysningene for å oppfylle leiekontrakten, for å
            bekrefte identitet, for forsikringsformål, og for å forbedre
            tjenesten.
          </Section>

          <Section title="Lagring">
            Opplysninger lagres i Norge/EU. Bookinghistorikk oppbevares i
            minimum 5 år av regnskapshensyn (bokføringsloven).
          </Section>

          <Section title="Dine rettigheter">
            Du har rett til innsyn, retting, sletting, begrensning og
            dataportabilitet. Kontakt hei@rentobil.no for å utøve rettighetene.
            Klage kan rettes til Datatilsynet.
          </Section>

          <Section title="Informasjonskapsler">
            Vi bruker kun nødvendige cookies for innlogging og sesjon. Vi
            setter ikke sporingscookies før du samtykker.
          </Section>

          <Section title="Databehandlere">
            Vi bruker Neon (Postgres), Vercel (hosting), Stripe (betaling) og
            Vipps (betaling og identitet). Alle er GDPR-compliant.
          </Section>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-[color:var(--color-mute)]">{children}</p>
    </section>
  );
}
