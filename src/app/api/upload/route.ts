import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // clientPayload should contain bookingId + document type
        let parsed: { bookingId?: string; type?: string } = {};
        try {
          parsed = JSON.parse(clientPayload ?? "{}");
        } catch {
          // ignore
        }
        if (!parsed.bookingId) {
          throw new Error("Mangler bookingId");
        }
        const booking = await prisma.booking.findUnique({
          where: { id: parsed.bookingId },
        });
        if (!booking) throw new Error("Ukjent booking");

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/heic",
            "image/webp",
            "application/pdf",
          ],
          tokenPayload: clientPayload,
          maximumSizeInBytes: 15 * 1024 * 1024, // 15MB
          validUntil: Date.now() + 60 * 60 * 1000, // 1h
          addRandomSuffix: true,
          pathname,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const parsed = JSON.parse(tokenPayload ?? "{}") as {
            bookingId?: string;
            type?: "FOERERKORT" | "ID_FRONT" | "ID_BACK" | "SELFIE";
          };
          if (parsed.bookingId && parsed.type) {
            await prisma.document.create({
              data: {
                bookingId: parsed.bookingId,
                type: parsed.type,
                url: blob.url,
              },
            });
            await prisma.bookingEvent.create({
              data: {
                bookingId: parsed.bookingId,
                type: "DOCUMENT_UPLOADED",
                payload: { type: parsed.type, url: blob.url },
              },
            });
          }
        } catch (err) {
          console.error("Failed to persist uploaded document:", err);
        }
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Opplasting feilet";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
