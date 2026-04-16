export type CarCategory =
  | "Kompakt"
  | "Mellomklasse"
  | "SUV"
  | "Elbil"
  | "Varebil"
  | "Premium";

export type FuelType = "Bensin" | "Diesel" | "Hybrid" | "El";

export type Transmission = "Automat" | "Manuell";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: CarCategory;
  image: string;
  seats: number;
  doors: number;
  luggage: number;
  fuel: FuelType;
  transmission: Transmission;
  range: string;
  pricePerDay: number;
  pricePerMonth: number;
  features: string[];
  summary: string;
};

export const cars: Car[] = [
  {
    slug: "volkswagen-id4",
    name: "Volkswagen ID.4",
    brand: "Volkswagen",
    model: "ID.4",
    category: "Elbil",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 3,
    fuel: "El",
    transmission: "Automat",
    range: "520 km rekkevidde",
    pricePerDay: 990,
    pricePerMonth: 12900,
    features: [
      "Adaptiv cruise",
      "Varme i seter",
      "Apple CarPlay",
      "Android Auto",
      "Ryggekamera",
    ],
    summary:
      "Romslig elbil for hverdag og helg. Lang rekkevidde og rolig kjørekomfort.",
  },
  {
    slug: "tesla-model-y",
    name: "Tesla Model Y",
    brand: "Tesla",
    model: "Model Y",
    category: "Elbil",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 4,
    fuel: "El",
    transmission: "Automat",
    range: "565 km rekkevidde",
    pricePerDay: 1290,
    pricePerMonth: 14900,
    features: [
      "Autopilot",
      "Panoramatak",
      "Premium lyd",
      "Varme i ratt",
      "Superlader",
    ],
    summary: "Sportslig og rask elbil med stort bagasjerom og moderne teknologi.",
  },
  {
    slug: "volvo-xc60",
    name: "Volvo XC60",
    brand: "Volvo",
    model: "XC60",
    category: "SUV",
    image:
      "https://images.unsplash.com/photo-1669215421018-c12d93ddbfe8?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 4,
    fuel: "Hybrid",
    transmission: "Automat",
    range: "Ladbar hybrid",
    pricePerDay: 1490,
    pricePerMonth: 16900,
    features: [
      "Firehjulstrekk",
      "Harman Kardon lyd",
      "Head-up display",
      "Pilot Assist",
      "Skinnseter",
    ],
    summary:
      "Premium SUV med firehjulstrekk. Trygg og komfortabel på norske veier.",
  },
  {
    slug: "toyota-corolla",
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    category: "Kompakt",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 2,
    fuel: "Hybrid",
    transmission: "Automat",
    range: "Hybrid, lavt forbruk",
    pricePerDay: 690,
    pricePerMonth: 9900,
    features: [
      "Adaptiv cruise",
      "Filholder",
      "Apple CarPlay",
      "Automatisk nødbrems",
    ],
    summary:
      "Effektiv og driftssikker hybrid. Ideell for pendling og byturer.",
  },
  {
    slug: "skoda-octavia",
    name: "Škoda Octavia",
    brand: "Škoda",
    model: "Octavia Combi",
    category: "Mellomklasse",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 4,
    fuel: "Diesel",
    transmission: "Automat",
    range: "Stor stasjonsvogn",
    pricePerDay: 790,
    pricePerMonth: 11400,
    features: [
      "Stort bagasjerom",
      "DSG-automat",
      "Adaptiv cruise",
      "Navigasjon",
    ],
    summary:
      "Plassvennlig stasjonsvogn. Lang rekkevidde og rimelig drift.",
  },
  {
    slug: "bmw-i4",
    name: "BMW i4",
    brand: "BMW",
    model: "i4 eDrive40",
    category: "Premium",
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 3,
    fuel: "El",
    transmission: "Automat",
    range: "590 km rekkevidde",
    pricePerDay: 1690,
    pricePerMonth: 18900,
    features: [
      "Skinnseter",
      "Harman Kardon lyd",
      "Head-up display",
      "Adaptiv cruise",
      "Panoramatak",
    ],
    summary:
      "Premium elektrisk gran coupé med sportslig kjørefølelse.",
  },
  {
    slug: "ford-transit-custom",
    name: "Ford Transit Custom",
    brand: "Ford",
    model: "Transit Custom",
    category: "Varebil",
    image:
      "https://images.unsplash.com/photo-1609520505218-7421df47cd72?auto=format&fit=crop&w=1600&q=70",
    seats: 3,
    doors: 4,
    luggage: 10,
    fuel: "Diesel",
    transmission: "Manuell",
    range: "Stort lasterom",
    pricePerDay: 890,
    pricePerMonth: 12400,
    features: [
      "Skyvedør",
      "Ryggekamera",
      "Tilhengerfeste",
      "Apple CarPlay",
    ],
    summary:
      "Robust varebil for flytting, håndverkere og små bedrifter.",
  },
  {
    slug: "hyundai-ioniq5",
    name: "Hyundai IONIQ 5",
    brand: "Hyundai",
    model: "IONIQ 5",
    category: "Elbil",
    image:
      "https://images.unsplash.com/photo-1647437811008-ba7b7cd01910?auto=format&fit=crop&w=1600&q=70",
    seats: 5,
    doors: 5,
    luggage: 3,
    fuel: "El",
    transmission: "Automat",
    range: "507 km rekkevidde",
    pricePerDay: 1090,
    pricePerMonth: 13900,
    features: [
      "Hurtiglading 350 kW",
      "Vehicle-to-Load",
      "Varme i seter",
      "Panoramatak",
    ],
    summary:
      "Moderne elbil med ultra-rask lading og stort innvendig rom.",
  },
];

export function findCar(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

export const categories: CarCategory[] = [
  "Kompakt",
  "Mellomklasse",
  "SUV",
  "Elbil",
  "Varebil",
  "Premium",
];
