import type { Metadata } from "next";
import { BookingFlow } from "./BookingFlow";
import { getAllLocations } from "@/server/locations";

export const metadata: Metadata = {
  title: "Bestill bil",
  description: "Fullfør bestillingen din i få steg.",
};

type BookingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage(props: BookingPageProps) {
  const params = await props.searchParams;
  const carParam = params?.car;
  const initialCarSlug = typeof carParam === "string" ? carParam : undefined;

  const locationParam = params?.location;
  const initialLocationSlug =
    typeof locationParam === "string" ? locationParam : undefined;

  const pickupParam = params?.pickup;
  const initialPickup = typeof pickupParam === "string" ? pickupParam : undefined;

  const dropoffParam = params?.dropoff;
  const initialDropoff =
    typeof dropoffParam === "string" ? dropoffParam : undefined;

  const stepParam = params?.step;
  const stepNum =
    typeof stepParam === "string" ? Number.parseInt(stepParam, 10) : undefined;
  const initialStep =
    stepNum && stepNum >= 1 && stepNum <= 4 ? (stepNum as 1 | 2 | 3 | 4) : undefined;

  const locations = await getAllLocations();

  return (
    <section>
      <div className="container-x pt-14 pb-6 md:pt-20">
        <p className="eyebrow">Bestilling</p>
        <h1 className="headline-lg mt-3">Book din bil</h1>
      </div>
      <div className="container-x pb-20">
        <BookingFlow
          locations={locations}
          initialCarSlug={initialCarSlug}
          initialLocationSlug={initialLocationSlug}
          initialPickup={initialPickup}
          initialDropoff={initialDropoff}
          initialStep={initialStep}
        />
      </div>
    </section>
  );
}
