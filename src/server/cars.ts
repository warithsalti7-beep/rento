import "server-only";
import { prisma } from "@/lib/prisma";
import type { CarListItem } from "@/lib/types";

export async function getAllCars(): Promise<CarListItem[]> {
  const rows = await prisma.car.findMany({
    where: { status: "ACTIVE", listingStatus: "APPROVED" },
    orderBy: [{ pricePerDay: "asc" }, { brand: "asc" }],
  });
  return rows.map(toListItem);
}

export async function getCarBySlug(slug: string) {
  return prisma.car.findUnique({
    where: { slug },
    include: { location: true },
  });
}

export async function getFeaturedCars(limit = 4): Promise<CarListItem[]> {
  const rows = await prisma.car.findMany({
    where: { status: "ACTIVE", listingStatus: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toListItem);
}

export async function getAvailableCars(
  from: Date,
  to: Date,
  locationId?: string,
): Promise<CarListItem[]> {
  const rows = await prisma.car.findMany({
    where: {
      status: "ACTIVE",
      listingStatus: "APPROVED",
      ...(locationId ? { locationId } : {}),
      bookings: {
        none: {
          status: { in: ["PENDING", "CONFIRMED", "PAID"] },
          AND: [{ pickupAt: { lt: to } }, { dropoffAt: { gt: from } }],
        },
      },
      availability: {
        none: {
          AND: [{ startsAt: { lt: to } }, { endsAt: { gt: from } }],
        },
      },
    },
    orderBy: [{ pricePerDay: "asc" }, { brand: "asc" }],
  });
  return rows.map(toListItem);
}

function toListItem(car: Awaited<ReturnType<typeof prisma.car.findMany>>[number]): CarListItem {
  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    model: car.model,
    category: car.category,
    fuel: car.fuel,
    transmission: car.transmission,
    seats: car.seats,
    doors: car.doors,
    luggage: car.luggage,
    range: car.range,
    image: car.image,
    features: car.features,
    summary: car.summary,
    pricePerDay: car.pricePerDay,
    pricePerMonth: car.pricePerMonth,
  };
}

export async function isCarAvailable(
  carId: string,
  from: Date,
  to: Date,
): Promise<boolean> {
  const conflicts = await prisma.booking.count({
    where: {
      carId,
      status: { in: ["PENDING", "CONFIRMED", "PAID"] },
      AND: [{ pickupAt: { lt: to } }, { dropoffAt: { gt: from } }],
    },
  });
  if (conflicts > 0) return false;

  const blocks = await prisma.availability.count({
    where: {
      carId,
      AND: [{ startsAt: { lt: to } }, { endsAt: { gt: from } }],
    },
  });
  return blocks === 0;
}
