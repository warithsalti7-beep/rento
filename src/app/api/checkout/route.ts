import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStripe, stripe } from "@/lib/stripe";
import { createVippsPayment, isVippsEnabled } from "@/lib/vipps";

const schema = z.object({
  bookingId: z.string().min(1),
  method: z.enum(["auto", "vipps", "stripe"]).optional(),
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

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const method = parsed.data.method ?? "auto";
  const preferVipps =
    method === "vipps" || (method === "auto" && isVippsEnabled());

  // Prefer Vipps when configured
  if (preferVipps) {
    try {
      const vipps = await createVippsPayment({
        reference: booking.reference,
        amountOere: booking.total * 100,
        description: `${booking.car.brand} ${booking.car.model} · ${booking.days} ${booking.days === 1 ? "dag" : "dager"}`,
        returnUrl: `${origin}/booking/confirmation?reference=${booking.reference}`,
        fallbackRedirectUrl: `${origin}/booking/confirmation?reference=${booking.reference}`,
        customerPhone: booking.guestPhone ?? undefined,
      });
      if (vipps) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { vippsOrderId: vipps.reference },
        });
        await prisma.bookingEvent.create({
          data: {
            bookingId: booking.id,
            type: "CHECKOUT_CREATED",
            payload: { provider: "vipps" },
          },
        });
        return NextResponse.json({ url: vipps.url, provider: "vipps" });
      }
    } catch (err) {
      console.error("Vipps checkout failed, falling back to Stripe:", err);
    }
  }

  // Stripe fallback
  if (!stripe) {
    return NextResponse.json(
      { error: "Ingen betalingsløsning er konfigurert" },
      { status: 503 },
    );
  }

  const s = requireStripe();
  const session = await s.checkout.sessions.create({
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
  await prisma.bookingEvent.create({
    data: {
      bookingId: booking.id,
      type: "CHECKOUT_CREATED",
      payload: { provider: "stripe" },
    },
  });

  return NextResponse.json({ url: session.url, provider: "stripe" });
}
