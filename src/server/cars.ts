import "server-only";
import { prisma } from "@/lib/prisma";
import type { CarListItem } from "@/lib/types";

type CarWithLocation = Awaited<
  ReturnType<typeof prisma.car.findMany<{ include: { location: true } }>>
>[number];

export async function getAllCars(): Promise<CarListItem[]> {
  const rows = await prisma.car.findMany({
    where: { status: "ACTIVE", listingStatus: "APPROVED" },
    orderBy: [{ pricePerDay: "asc" }, { brand: "asc" }],
    include: { location: true },
  });
  return rows.map((r) => toListItem(r));
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
    include: { location: true },
  });
  return rows.map((r) => toListItem(r));
}

// Returns all cars available for the date range. If a preferred location is
// given, cars matching it come first and are flagged with
// `locationMatchesRequest`. Cars at other locations are still returned with a
// "leveres fra X" hint so the user never sees an empty fleet.
export async function getAvailableCars(
  from: Date,
  to: Date,
  locationId?: string,
): Promise<CarListItem[]> {
  const rows = await prisma.car.findMany({
    where: {
      status: "ACTIVE",
      listingStatus: "APPROVED",
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
    include: { location: true },
  });

  const mapped = rows.map((r) =>
    toListItem(r, {
      locationMatchesRequest: Boolean(
        locationId && r.locationId === locationId,
      ),
    }),
  );

  // Cars at the preferred location first, rest after.
  if (locationId) {
    return [...mapped].sort((a, b) => {
      if (a.locationMatchesRequest === b.locationMatchesRequest) return 0;
      return a.locationMatchesRequest ? -1 : 1;
    });
  }
  return mapped;
}

function toListItem(
  car: CarWithLocation,
  extra?: { locationMatchesRequest?: boolean },
): CarListItem {
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
    location: car.location
      ? { slug: car.location.slug, city: car.location.city }
      : null,
    locationMatchesRequest: extra?.locationMatchesRequest,
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
