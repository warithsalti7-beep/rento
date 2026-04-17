import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().email("Ugyldig e-post"),
  topic: z.string().min(1),
  body: z.string().min(1, "Melding er påkrevd"),
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

  const message = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ id: message.id, ok: true });
}
