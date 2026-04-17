import type {
  CarCategory as PrismaCarCategory,
  FuelType as PrismaFuelType,
  Transmission as PrismaTransmission,
} from "@prisma/client";

// UI-facing (Norwegian bokmål) labels for enums.
export const carCategoryLabel: Record<PrismaCarCategory, string> = {
  KOMPAKT: "Kompakt",
  MELLOMKLASSE: "Mellomklasse",
  SUV: "SUV",
  ELBIL: "Elbil",
  VAREBIL: "Varebil",
  PREMIUM: "Premium",
};

export const fuelLabel: Record<PrismaFuelType, string> = {
  BENSIN: "Bensin",
  DIESEL: "Diesel",
  HYBRID: "Hybrid",
  EL: "El",
};

export const transmissionLabel: Record<PrismaTransmission, string> = {
  AUTOMAT: "Automat",
  MANUELL: "Manuell",
};

export const allCategories: PrismaCarCategory[] = [
  "KOMPAKT",
  "MELLOMKLASSE",
  "SUV",
  "ELBIL",
  "VAREBIL",
  "PREMIUM",
];

export type CarListItem = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  category: PrismaCarCategory;
  fuel: PrismaFuelType;
  transmission: PrismaTransmission;
  seats: number;
  doors: number;
  luggage: number;
  range: string;
  image: string;
  features: string[];
  summary: string;
  pricePerDay: number;
  pricePerMonth: number;
  location?: { slug: string; city: string } | null;
  locationMatchesRequest?: boolean;
};

export type LocationListItem = {
  id: string;
  slug: string;
  city: string;
  address: string;
  hours: string;
};

export type PricingTierListItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceFromMonth: number;
  highlight: boolean;
  includes: string[];
};
