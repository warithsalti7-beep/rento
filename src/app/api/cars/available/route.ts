import { NextResponse } from "next/server";
import { getAvailableCars } from "@/server/cars";
import { getLocationBySlug } from "@/server/locations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pickup = url.searchParams.get("pickup");
  const dropoff = url.searchParams.get("dropoff");
  const locationSlug = url.searchParams.get("location");

  if (!pickup || !dropoff) {
    return NextResponse.json({ error: "Mangler datoer" }, { status: 400 });
  }
  const from = new Date(pickup);
  const to = new Date(dropoff);
  if (isNaN(from.getTime()) || isNaN(to.getTime()) || to <= from) {
    return NextResponse.json({ error: "Ugyldige datoer" }, { status: 400 });
  }

  let locationId: string | undefined;
  if (locationSlug) {
    const loc = await getLocationBySlug(locationSlug);
    if (loc) locationId = loc.id;
  }

  const cars = await getAvailableCars(from, to, locationId);
  return NextResponse.json(cars);
}
