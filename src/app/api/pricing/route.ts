import { NextResponse } from "next/server";
import { getPricingTiers } from "@/server/pricing";

export const revalidate = 300;

export async function GET() {
  const tiers = await getPricingTiers();
  return NextResponse.json(tiers);
}
