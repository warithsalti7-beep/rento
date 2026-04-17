import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/server/bookings";

const schema = z.object({
  carId: z.string().min(1),
  pickupLocationId: z.string().min(1),
  dropoffLocationId: z.string().optional(),
  pickupAt: z.string().min(1),
  dropoffAt: z.string().min(1),
  guestName: z.string().min(1, "Navn er påkrevd"),
  guestEmail: z.string().email("Ugyldig e-post"),
  guestPhone: z.string().min(5, "Telefon er påkrevd"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validering feilet", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const booking = await createBooking({
      ...parsed.data,
      pickupAt: new Date(parsed.data.pickupAt),
      dropoffAt: new Date(parsed.data.dropoffAt),
    });
    return NextResponse.json({
      reference: booking.reference,
      total: booking.total,
      days: booking.days,
      id: booking.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Noe gikk galt";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
