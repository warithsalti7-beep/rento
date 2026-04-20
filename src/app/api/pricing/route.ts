import { NextResponse } from "next/server";
import { getPricingTiers } from "@/server/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  const tiers = await getPricingTiers();
  return NextResponse.json(tiers);
}
