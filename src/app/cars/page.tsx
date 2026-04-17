import type { Metadata } from "next";
import { getAllCars } from "@/server/cars";
import { CarFilters } from "./CarFilters";

export const metadata: Metadata = {
  title: "Biler til leie",
  description:
    "Se hele utvalget av biler – elbiler, hybrider, varebiler og SUV-er. Lei per dag eller per måned.",
};

export const revalidate = 60;

export default async function CarsPage() {
  const cars = await getAllCars();

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Bilutvalg</p>
        <h1 className="headline-lg mt-3">Finn riktig bil</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)]">
          Utforsk hele flåten vår. Forsikring, veihjelp og vedlikehold er inkludert i alle priser.
        </p>
      </div>
      <div className="container-x pb-20">
        <CarFilters cars={cars} />
      </div>
    </section>
  );
}
