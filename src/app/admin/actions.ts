"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type {
  CarCategory,
  FuelType,
  Transmission,
  CarStatus,
} from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Ingen tilgang");
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createCar(formData: FormData) {
  await requireAdmin();

  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  if (!brand || !model) throw new Error("Mangler merke/modell");

  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(`${brand}-${model}`);

  await prisma.car.create({
    data: {
      slug,
      brand,
      model,
      category: String(formData.get("category") ?? "KOMPAKT") as CarCategory,
      fuel: String(formData.get("fuel") ?? "BENSIN") as FuelType,
      transmission: String(formData.get("transmission") ?? "AUTOMAT") as Transmission,
      seats: Number(formData.get("seats") ?? 5),
      doors: Number(formData.get("doors") ?? 5),
      luggage: Number(formData.get("luggage") ?? 2),
      range: String(formData.get("range") ?? ""),
      image: String(formData.get("image") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      features: String(formData.get("features") ?? "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      pricePerDay: Number(formData.get("pricePerDay") ?? 0),
      pricePerMonth: Number(formData.get("pricePerMonth") ?? 0),
      locationId: String(formData.get("locationId") ?? "") || null,
      status: "ACTIVE",
    },
  });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
}

export async function updateCarStatus(carId: string, status: CarStatus) {
  await requireAdmin();
  await prisma.car.update({ where: { id: carId }, data: { status } });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
}

export async function deleteCar(carId: string) {
  await requireAdmin();
  await prisma.car.update({
    where: { id: carId },
    data: { status: "ARCHIVED" },
  });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
}

export async function createLocation(formData: FormData) {
  await requireAdmin();
  const city = String(formData.get("city") ?? "").trim();
  if (!city) throw new Error("Mangler by");
  await prisma.location.create({
    data: {
      slug: String(formData.get("slug") ?? "").trim() || slugify(city),
      city,
      address: String(formData.get("address") ?? ""),
      hours: String(formData.get("hours") ?? ""),
    },
  });
  revalidatePath("/admin/locations");
}

export async function toggleLocation(locationId: string, active: boolean) {
  await requireAdmin();
  await prisma.location.update({
    where: { id: locationId },
    data: { active },
  });
  revalidatePath("/admin/locations");
}

export async function updatePricingTier(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Mangler id");
  await prisma.pricingTier.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      tagline: String(formData.get("tagline") ?? ""),
      priceFromMonth: Number(formData.get("priceFromMonth") ?? 0),
      highlight: formData.get("highlight") === "on",
      includes: String(formData.get("includes") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    },
  });
  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
  revalidatePath("/");
}

export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED" | "COMPLETED",
) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
  revalidatePath("/admin/bookings");
}

export async function markMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id },
    data: { handled },
  });
  revalidatePath("/admin/messages");
}
