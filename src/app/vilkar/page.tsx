import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vilkår",
  description: "Rento sine generelle leievilkår.",
};

export default function VilkarPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-20 md:pt-20">
        <p className="eyebrow">Vilkår</p>
        <h1 className="headline-lg mt-3">Generelle leievilkår</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Sist oppdatert: 17. april 2026.
        </p>

        <div className="mt-12 max-w-2xl space-y-10 text-[color:var(--color-ink)]">
          <Section title="1. Om Rento">
            Rento AS (heretter «Rento») tilbyr korttids- og langtidsleie av biler
            i Norge. Leieforholdet reguleres av disse vilkårene og den til enhver
            tid gjeldende norske forbrukerkjøpsloven.
          </Section>

          <Section title="2. Førerkort og alder">
            Leietaker må være fylt 21 år og ha hatt gyldig førerkort klasse B
            sammenhengende i minst to år. Førerkort og gyldig legitimasjon må
            fremvises før utlevering av bilen.
          </Section>

          <Section title="3. Betaling og depositum">
            Betaling belastes ved booking. Et depositum kan reserveres ved
            utlevering og frigjøres når bilen leveres tilbake uten skade.
            Betalingen skjer via Stripe eller Vipps.
          </Section>

          <Section title="4. Forsikring og egenandel">
            Alle biler er fullforsikret hos godkjent norsk forsikringsselskap.
            Egenandel ved skade er angitt i valgt abonnement. Egenandel
            forfaller dersom skade oppstår.
          </Section>

          <Section title="5. Avbestilling">
            Bestillingen kan avbestilles vederlagsfritt inntil 48 timer før
            avtalt hentetidspunkt. Senere avbestilling kan medføre gebyr.
          </Section>

          <Section title="6. Ansvar">
            Leietaker er ansvarlig for bilen i leieperioden, inkludert bøter,
            bompenger og parkeringsgebyr. Kjøring i utlandet krever forhåndsavtale.
          </Section>

          <Section title="7. Kontakt og klage">
            Henvendelser rettes til hei@rentobil.no. Klage kan ved uenighet
            bringes inn for Forbrukertilsynet.
          </Section>

          <Section title="8. Lovvalg og verneting">
            Avtalen reguleres av norsk rett. Oslo tingrett er avtalt verneting.
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
