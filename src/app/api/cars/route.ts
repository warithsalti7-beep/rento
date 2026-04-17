import { NextResponse } from "next/server";
import { getAllCars } from "@/server/cars";

export const dynamic = "force-dynamic";

export async function GET() {
  const cars = await getAllCars();
  return NextResponse.json(cars);
}
