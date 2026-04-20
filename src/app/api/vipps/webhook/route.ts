import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vipps ePayment webhook.
// Vipps signs the webhook with your subscription key. For production,
// validate the `Authorization` header per Vipps docs.
export const runtime = "nodejs";

export async function POST(req: Request) {
  type VippsPayload = { reference?: string; name?: string; success?: boolean };
  let payload: VippsPayload | null = null;
  try {
    payload = (await req.json()) as VippsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!payload?.reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // For now we trust the reference + event name. Add signature validation
  // once we have the Vipps merchant subscription key in production.
  const booking = await prisma.booking.findUnique({
    where: { reference: payload.reference },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const event = payload.name ?? "UNKNOWN";
  const patch: Parameters<typeof prisma.booking.update>[0]["data"] = {};

  if (event === "AUTHORIZED" || event === "CAPTURED") {
    patch.status = "PAID";
    patch.payment = event === "CAPTURED" ? "CAPTURED" : "AUTHORIZED";
  } else if (event === "ABORTED" || event === "EXPIRED" || event === "CANCELLED") {
    patch.status = "CANCELLED";
    patch.payment = "FAILED";
  }

  if (Object.keys(patch).length > 0) {
    await prisma.booking.update({ where: { id: booking.id }, data: patch });
  }

  await prisma.bookingEvent.create({
    data: {
      bookingId: booking.id,
      type: `VIPPS_${event}`,
      payload: payload as object,
    },
  });

  return NextResponse.json({ received: true });
}
