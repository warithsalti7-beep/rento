import type { Metadata } from "next";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = {
  title: "Bestill bil",
  description: "Fullfør bestillingen din i få steg.",
};

export default async function BookingPage(props: PageProps<"/booking">) {
  const params = await props.searchParams;
  const carParam = params?.car;
  const initialCarSlug = typeof carParam === "string" ? carParam : undefined;

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Bestilling</p>
        <h1 className="headline-lg mt-3">Book din bil</h1>
      </div>
      <div className="container-x pb-20">
        <BookingFlow initialCarSlug={initialCarSlug} />
      </div>
    </section>
  );
}
