import type { Metadata } from "next";
import { LinkButton } from "@/components/Button";
import { getAllLocations } from "@/server/locations";

export const metadata: Metadata = {
  title: "Om Rento",
  description: "Rento gjør bilutleie enkelt i Norge — og skal bli markedsplassen for leie.",
};

export const dynamic = "force-dynamic";

const values = [
  {
    title: "Enkelhet først",
    body: "Vi fjerner alt som står mellom deg og bilen. Ingen skjemaer, ingen lange kontrakter.",
  },
  {
    title: "Gjennomsiktige priser",
    body: "Én pris. Alt inkludert. Ingen gebyrer som dukker opp i sluttregningen.",
  },
  {
    title: "Moderne flåte",
    body: "Vi investerer i elbiler og hybrider. Bra for deg — og for norske veier.",
  },
];

export default async function AboutPage() {
  const locations = await getAllLocations();

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Om Rento</p>
        <h1 className="headline-lg mt-3 max-w-3xl">
          Vi bygger Norges enkleste måte å leie bil på.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-mute)]">
          Rento startet som en bilutleietjeneste. Målet vårt er å bli markedsplassen der hvem som helst kan leie — bil, varebil og etter hvert også andre verdier.
        </p>
      </div>

      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <h2 className="headline-md">{value.title}</h2>
              <p className="mt-3 text-[color:var(--color-mute)]">{value.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x py-16">
        <div className="rounded-3xl border border-[color:var(--color-line)] p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="eyebrow">Veikart</p>
              <h2 className="headline-md mt-3">Fra utleie til markedsplass</h2>
            </div>
            <ol className="md:col-span-2 space-y-6">
              <li className="flex gap-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-sm font-semibold text-[color:var(--color-accent)]">
                  1
                </span>
                <div>
                  <p className="font-semibold">Egen flåte</p>
                  <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                    Vi drifter og kvalitetssikrer flåten selv for å sikre en god start.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-sm font-semibold text-[color:var(--color-accent)]">
                  2
                </span>
                <div>
                  <p className="font-semibold">Privat utleie</p>
                  <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                    Privatpersoner kan leie ut sin egen bil gjennom plattformen.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-sm font-semibold text-[color:var(--color-accent)]">
                  3
                </span>
                <div>
                  <p className="font-semibold">Mer enn biler</p>
                  <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                    Utvid til andre kategorier — verktøy, utstyr og mer.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="container-x py-16">
        <p className="eyebrow">Lokasjoner</p>
        <h2 className="headline-md mt-3">Vi finnes i seks byer</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <li
              key={loc.slug}
              className="rounded-2xl border border-[color:var(--color-line)] bg-white p-5"
            >
              <p className="text-sm font-semibold">{loc.city}</p>
              <p className="mt-1 text-sm text-[color:var(--color-mute)]">{loc.address}</p>
              <p className="mt-2 text-xs text-[color:var(--color-mute)]">{loc.hours}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x pb-20">
        <div className="rounded-3xl bg-[color:var(--color-fog)] p-10 md:p-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="headline-md">Vil du jobbe med oss?</h2>
              <p className="mt-2 text-[color:var(--color-mute)]">
                Vi ansetter i Oslo og Bergen. Send oss en hilsen.
              </p>
            </div>
            <LinkButton href="/contact" variant="secondary" size="lg">
              Kontakt oss
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
