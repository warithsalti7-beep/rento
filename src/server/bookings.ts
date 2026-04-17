import "server-only";
import { prisma } from "@/lib/prisma";
import { isCarAvailable } from "./cars";

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
  const car = await prisma.car.findUnique({ where: { id: input.carId } });
  if (!car) throw new Error("Bilen finnes ikke");

  if (input.dropoffAt <= input.pickupAt) {
    throw new Error("Leveringsdato må være etter hentedato");
  }

  const available = await isCarAvailable(
    car.id,
    input.pickupAt,
    input.dropoffAt,
  );
  if (!available) throw new Error("Bilen er ikke ledig i valgt periode");

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

  return prisma.booking.create({
    data: {
      reference: generateReference(),
      carId: car.id,
      pickupLocationId: input.pickupLocationId,
      dropoffLocationId: input.dropoffLocationId ?? input.pickupLocationId,
      pickupAt: input.pickupAt,
      dropoffAt: input.dropoffAt,
      days,
      subtotal,
      delivery,
      total,
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
