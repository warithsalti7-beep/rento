import "server-only";
import { prisma } from "@/lib/prisma";
import type { PricingTierListItem } from "@/lib/types";

export async function getPricingTiers(): Promise<PricingTierListItem[]> {
  const rows = await prisma.pricingTier.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    priceFromMonth: t.priceFromMonth,
    highlight: t.highlight,
    includes: t.includes,
  }));
}
