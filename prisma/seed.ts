import { PrismaClient, CarCategory, FuelType, Transmission } from "@prisma/client";

const prisma = new PrismaClient();

const locations = [
  {
    slug: "oslo-sentrum",
    city: "Oslo sentrum",
    address: "Storgata 12, 0184 Oslo",
    hours: "Man–lør 07–22, søn 09–20",
  },
  {
    slug: "oslo-lufthavn",
    city: "Oslo lufthavn",
    address: "Edvard Munchs veg 3, 2061 Gardermoen",
    hours: "Åpent alle dager 06–24",
  },
  {
    slug: "bergen",
    city: "Bergen",
    address: "Strandgaten 207, 5004 Bergen",
    hours: "Man–lør 07–21, søn 10–19",
  },
  {
    slug: "trondheim",
    city: "Trondheim",
    address: "Olav Tryggvasons gate 24, 7011 Trondheim",
    hours: "Man–lør 07–21, søn stengt",
  },
  {
    slug: "stavanger",
    city: "Stavanger",
    address: "Klubbgata 3, 4013 Stavanger",
    hours: "Man–lør 08–20, søn stengt",
  },
  {
    slug: "tromso",
    city: "Tromsø",
    address: "Storgata 58, 9008 Tromsø",
    hours: "Man–fre 08–19, lør 10–16",
  },
];

const pricingTiers = [
  {
    slug: "standard",
    name: "Standard",
    tagline: "For hverdagsbruk",
    priceFromMonth: 12900,
    highlight: false,
    sortOrder: 1,
    includes: [
      "1 500 km inkludert per måned",
      "Forsikring og veihjelp",
      "Vedlikehold og dekk",
      "Fri avbestilling inntil 48 t",
    ],
  },
  {
    slug: "plus",
    name: "Plus",
    tagline: "Mest valgt",
    priceFromMonth: 14900,
    highlight: true,
    sortOrder: 2,
    includes: [
      "2 500 km inkludert per måned",
      "Levering til døren",
      "Egenandel redusert til 3 000 kr",
      "Bytt bil én gang per måned",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    tagline: "For deg som vil ha mer",
    priceFromMonth: 16900,
    highlight: false,
    sortOrder: 3,
    includes: [
      "Ubegrenset kilometer",
      "Prioritert levering og henting",
      "Ingen egenandel",
      "Oppgradering ved ledighet",
    ],
  },
];

const cars: Array<{
  slug: string;
  brand: string;
  model: string;
  category: CarCategory;
  fuel: FuelType;
  transmission: Transmission;
  seats: number;
  doors: number;
  luggage: number;
  range: string;
  image: string;
  features: string[];
  summary: string;
  pricePerDay: number;
  pricePerMonth: number;
  locationSlug: string;
}> = [
  {
    slug: "volkswagen-id4",
    brand: "Volkswagen",
    model: "ID.4",
    category: "ELBIL",
    fuel: "EL",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 3,
    range: "520 km rekkevidde",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=70",
    features: ["Adaptiv cruise", "Varme i seter", "Apple CarPlay", "Android Auto", "Ryggekamera"],
    summary: "Romslig elbil for hverdag og helg. Lang rekkevidde og rolig kjørekomfort.",
    pricePerDay: 990,
    pricePerMonth: 12900,
    locationSlug: "oslo-sentrum",
  },
  {
    slug: "tesla-model-y",
    brand: "Tesla",
    model: "Model Y",
    category: "ELBIL",
    fuel: "EL",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 4,
    range: "565 km rekkevidde",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=70",
    features: ["Autopilot", "Panoramatak", "Premium lyd", "Varme i ratt", "Superlader"],
    summary: "Sportslig og rask elbil med stort bagasjerom og moderne teknologi.",
    pricePerDay: 1290,
    pricePerMonth: 14900,
    locationSlug: "oslo-sentrum",
  },
  {
    slug: "volvo-xc60",
    brand: "Volvo",
    model: "XC60",
    category: "SUV",
    fuel: "HYBRID",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 4,
    range: "Ladbar hybrid",
    image:
      "https://images.unsplash.com/photo-1669215421018-c12d93ddbfe8?auto=format&fit=crop&w=1600&q=70",
    features: ["Firehjulstrekk", "Harman Kardon lyd", "Head-up display", "Pilot Assist", "Skinnseter"],
    summary: "Premium SUV med firehjulstrekk. Trygg og komfortabel på norske veier.",
    pricePerDay: 1490,
    pricePerMonth: 16900,
    locationSlug: "bergen",
  },
  {
    slug: "toyota-corolla",
    brand: "Toyota",
    model: "Corolla",
    category: "KOMPAKT",
    fuel: "HYBRID",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 2,
    range: "Hybrid, lavt forbruk",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1600&q=70",
    features: ["Adaptiv cruise", "Filholder", "Apple CarPlay", "Automatisk nødbrems"],
    summary: "Effektiv og driftssikker hybrid. Ideell for pendling og byturer.",
    pricePerDay: 690,
    pricePerMonth: 9900,
    locationSlug: "trondheim",
  },
  {
    slug: "skoda-octavia",
    brand: "Škoda",
    model: "Octavia Combi",
    category: "MELLOMKLASSE",
    fuel: "DIESEL",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 4,
    range: "Stor stasjonsvogn",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1600&q=70",
    features: ["Stort bagasjerom", "DSG-automat", "Adaptiv cruise", "Navigasjon"],
    summary: "Plassvennlig stasjonsvogn. Lang rekkevidde og rimelig drift.",
    pricePerDay: 790,
    pricePerMonth: 11400,
    locationSlug: "stavanger",
  },
  {
    slug: "bmw-i4",
    brand: "BMW",
    model: "i4 eDrive40",
    category: "PREMIUM",
    fuel: "EL",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 3,
    range: "590 km rekkevidde",
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=70",
    features: ["Skinnseter", "Harman Kardon lyd", "Head-up display", "Adaptiv cruise", "Panoramatak"],
    summary: "Premium elektrisk gran coupé med sportslig kjørefølelse.",
    pricePerDay: 1690,
    pricePerMonth: 18900,
    locationSlug: "oslo-sentrum",
  },
  {
    slug: "ford-transit-custom",
    brand: "Ford",
    model: "Transit Custom",
    category: "VAREBIL",
    fuel: "DIESEL",
    transmission: "MANUELL",
    seats: 3,
    doors: 4,
    luggage: 10,
    range: "Stort lasterom",
    image:
      "https://images.unsplash.com/photo-1609520505218-7421df47cd72?auto=format&fit=crop&w=1600&q=70",
    features: ["Skyvedør", "Ryggekamera", "Tilhengerfeste", "Apple CarPlay"],
    summary: "Robust varebil for flytting, håndverkere og små bedrifter.",
    pricePerDay: 890,
    pricePerMonth: 12400,
    locationSlug: "oslo-lufthavn",
  },
  {
    slug: "hyundai-ioniq5",
    brand: "Hyundai",
    model: "IONIQ 5",
    category: "ELBIL",
    fuel: "EL",
    transmission: "AUTOMAT",
    seats: 5,
    doors: 5,
    luggage: 3,
    range: "507 km rekkevidde",
    image:
      "https://images.unsplash.com/photo-1647437811008-ba7b7cd01910?auto=format&fit=crop&w=1600&q=70",
    features: ["Hurtiglading 350 kW", "Vehicle-to-Load", "Varme i seter", "Panoramatak"],
    summary: "Moderne elbil med ultra-rask lading og stort innvendig rom.",
    pricePerDay: 1090,
    pricePerMonth: 13900,
    locationSlug: "tromso",
  },
];

async function main() {
  console.log("🌱 Seeding Rento...");

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: loc,
      create: loc,
    });
  }
  console.log(`  ✓ ${locations.length} locations`);

  for (const tier of pricingTiers) {
    await prisma.pricingTier.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }
  console.log(`  ✓ ${pricingTiers.length} pricing tiers`);

  const locBySlug = Object.fromEntries(
    (await prisma.location.findMany()).map((l) => [l.slug, l.id]),
  );

  for (const car of cars) {
    const { locationSlug, ...rest } = car;
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: { ...rest, locationId: locBySlug[locationSlug] },
      create: { ...rest, locationId: locBySlug[locationSlug] },
    });
  }
  console.log(`  ✓ ${cars.length} cars`);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rentobil.no" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@rentobil.no",
      name: "Rento Admin",
      role: "ADMIN",
    },
  });
  console.log(`  ✓ admin user (${admin.email})`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
