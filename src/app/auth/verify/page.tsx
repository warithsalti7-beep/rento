import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sjekk e-posten din" };

export default function VerifyPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-20 md:pt-20">
        <div className="mx-auto max-w-md text-center">
          <p className="eyebrow">Nesten der</p>
          <h1 className="headline-lg mt-3">Sjekk e-posten din</h1>
          <p className="mt-4 text-[color:var(--color-mute)]">
            Vi har sendt deg en lenke. Klikk på den for å logge inn på Rento.
          </p>
        </div>
      </div>
    </section>
  );
}
