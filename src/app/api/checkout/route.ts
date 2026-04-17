import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

const schema = z.object({
  bookingId: z.string().min(1),
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
    return NextResponse.json({ error: "Validering feilet" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { car: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking ikke funnet" }, { status: 404 });
  }

  const stripe = requireStripe();
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    locale: "nb",
    line_items: [
      {
        price_data: {
          currency: "nok",
          product_data: {
            name: `${booking.car.brand} ${booking.car.model}`,
            description: `${booking.days} ${booking.days === 1 ? "dag" : "dager"} · ref ${booking.reference}`,
          },
          unit_amount: booking.total * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: booking.guestEmail ?? undefined,
    metadata: { bookingId: booking.id, reference: booking.reference },
    success_url: `${origin}/booking/confirmation?reference=${booking.reference}`,
    cancel_url: `${origin}/booking?car=${booking.car.slug}&cancelled=1`,
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
