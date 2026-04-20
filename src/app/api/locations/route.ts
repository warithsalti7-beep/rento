import { NextResponse } from "next/server";
import { getAllLocations } from "@/server/locations";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await getAllLocations();
  return NextResponse.json(locations);
}
