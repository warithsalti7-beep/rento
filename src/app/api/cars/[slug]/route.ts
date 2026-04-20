import { NextResponse } from "next/server";
import { getCarBySlug } from "@/server/cars";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const car = await getCarBySlug(slug);
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}
