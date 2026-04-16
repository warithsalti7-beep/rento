export type PricingTier = {
  id: "standard" | "plus" | "premium";
  name: string;
  tagline: string;
  priceFromMonth: number;
  highlight?: boolean;
  includes: string[];
};

export const pricingTiers: PricingTier[] = [
  {
    id: "standard",
    name: "Standard",
    tagline: "For hverdagsbruk",
    priceFromMonth: 12900,
    includes: [
      "1 500 km inkludert per måned",
      "Forsikring og veihjelp",
      "Vedlikehold og dekk",
      "Fri avbestilling inntil 48 t",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Mest valgt",
    priceFromMonth: 14900,
    highlight: true,
    includes: [
      "2 500 km inkludert per måned",
      "Levering til døren",
      "Egenandel redusert til 3 000 kr",
      "Bytt bil én gang per måned",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For deg som vil ha mer",
    priceFromMonth: 16900,
    includes: [
      "Ubegrenset kilometer",
      "Prioritert levering og henting",
      "Ingen egenandel",
      "Oppgradering ved ledighet",
    ],
  },
];
