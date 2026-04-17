import { NextResponse } from "next/server";
import { getBookingByReference } from "@/server/bookings";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ reference: string }> },
) {
  const { reference } = await ctx.params;
  const booking = await getBookingByReference(reference);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}
