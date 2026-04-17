import "server-only";
import { prisma } from "@/lib/prisma";

function generateReference() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const num = Math.floor(Math.random() * 90 + 10);
  return `RE-${rand}${num}`;
}

export type CreateBookingInput = {
  carId: string;
  pickupLocationId: string;
  dropoffLocationId?: string;
  pickupAt: Date;
  dropoffAt: Date;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  userId?: string;
  notes?: string;
};

export async function createBooking(input: CreateBookingInput) {
  if (input.dropoffAt <= input.pickupAt) {
    throw new Error("Leveringsdato må være etter hentedato");
  }
  const now = new Date();
  if (input.pickupAt < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    throw new Error("Hentedato kan ikke være i fortiden");
  }

  // Serializable transaction: atomic availability check + create.
  // Postgres will abort one of two concurrent transactions that overlap,
  // so we prevent double-booking at the DB level.
  return prisma.$transaction(
    async (tx) => {
      const car = await tx.car.findUnique({ where: { id: input.carId } });
      if (!car) throw new Error("Bilen finnes ikke");

      const conflict = await tx.booking.count({
        where: {
          carId: car.id,
          status: { in: ["PENDING", "CONFIRMED", "PAID"] },
          AND: [
            { pickupAt: { lt: input.dropoffAt } },
            { dropoffAt: { gt: input.pickupAt } },
          ],
        },
      });
      if (conflict > 0) {
        throw new Error("Bilen er ikke ledig i valgt periode");
      }

      const block = await tx.availability.count({
        where: {
          carId: car.id,
          AND: [
            { startsAt: { lt: input.dropoffAt } },
            { endsAt: { gt: input.pickupAt } },
          ],
        },
      });
      if (block > 0) {
        throw new Error("Bilen er utilgjengelig i valgt periode");
      }

      const days = Math.max(
        1,
        Math.round(
          (input.dropoffAt.getTime() - input.pickupAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      const subtotal = car.pricePerDay * days;
      const delivery = 0;
      const total = subtotal + delivery;

      const booking = await tx.booking.create({
        data: {
          reference: generateReference(),
          carId: car.id,
          pickupLocationId: input.pickupLocationId,
          dropoffLocationId:
            input.dropoffLocationId ?? input.pickupLocationId,
          pickupAt: input.pickupAt,
          dropoffAt: input.dropoffAt,
          days,
          subtotal,
          delivery,
          total,
          priceBreakdown: {
            base: subtotal,
            delivery,
            discount: 0,
            vat: 0,
            deposit: 0,
          },
          userId: input.userId,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          notes: input.notes,
          status: "PENDING",
        },
        include: {
          car: true,
          pickupLocation: true,
          dropoffLocation: true,
        },
      });

      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          type: "CREATED",
          payload: { total, days },
          actorId: input.userId ?? null,
        },
      });

      return booking;
    },
    { isolationLevel: "Serializable" },
  );
}

export async function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({
    where: { reference },
    include: {
      car: true,
      pickupLocation: true,
      dropoffLocation: true,
    },
  });
}

export async function getBookingsForUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { car: true, pickupLocation: true },
    orderBy: { pickupAt: "desc" },
  });
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: { car: true, pickupLocation: true, user: true },
    orderBy: { createdAt: "desc" },
  });
}
