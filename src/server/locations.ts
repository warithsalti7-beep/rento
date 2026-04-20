import "server-only";
import { prisma } from "@/lib/prisma";
import type { LocationListItem } from "@/lib/types";

export async function getAllLocations(): Promise<LocationListItem[]> {
  const rows = await prisma.location.findMany({
    where: { active: true },
    orderBy: { city: "asc" },
  });
  return rows.map((l) => ({
    id: l.id,
    slug: l.slug,
    city: l.city,
    address: l.address,
    hours: l.hours,
  }));
}

export async function getLocationBySlug(slug: string) {
  return prisma.location.findUnique({ where: { slug } });
}
