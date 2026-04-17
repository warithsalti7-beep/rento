import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-12-18.acacia" })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "STRIPE_SECRET_KEY mangler. Sett miljøvariabelen i .env.local / Vercel.",
    );
  }
  return stripe;
}
