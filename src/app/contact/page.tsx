import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt Rento kundeservice.",
};

export default function ContactPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Kontakt</p>
        <h1 className="headline-lg mt-3">Vi er her for å hjelpe</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Kundeservice er tilgjengelig alle hverdager 08–20 og helger 10–18.
        </p>
      </div>

      <div className="container-x pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <ContactForm />
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                E-post
              </p>
              <p className="mt-2 text-base font-medium">hei@rentobil.no</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Telefon
              </p>
              <p className="mt-2 text-base font-medium">+47 22 00 00 00</p>
              <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                Hverdager 08–20 · Helg 10–18
              </p>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Hovedkontor
              </p>
              <p className="mt-2 text-base font-medium">Rento AS</p>
              <p className="mt-1 text-sm text-[color:var(--color-mute)]">
                Storgata 12, 0184 Oslo
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
