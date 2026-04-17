import { NextResponse } from "next/server";
import { getAllLocations } from "@/server/locations";

export const revalidate = 300;

export async function GET() {
  const locations = await getAllLocations();
  return NextResponse.json(locations);
}
