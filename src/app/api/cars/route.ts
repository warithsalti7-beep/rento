import { NextResponse } from "next/server";
import { getAllCars } from "@/server/cars";

export const revalidate = 60;

export async function GET() {
  const cars = await getAllCars();
  return NextResponse.json(cars);
}
