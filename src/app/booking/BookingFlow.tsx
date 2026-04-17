"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CarListItem, LocationListItem } from "@/lib/types";
import {
  carCategoryLabel,
  fuelLabel,
  transmissionLabel,
} from "@/lib/types";
import { formatKr, formatKrPerDay } from "@/lib/format";
import { TrustRow } from "@/components/TrustRow";

type Step = 1 | 2 | 3 | 4;

const stepLabels: Record<Step, string> = {
  1: "Sted og dato",
  2: "Velg bil",
  3: "Om deg",
  4: "Betaling",
};

const STORAGE_KEY = "rento.booking.v1";

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function isPickupValid(pickup: string, dropoff: string): string | null {
  if (!pickup || !dropoff) return "Velg hente- og leveringsdato";
  const p = new Date(pickup);
  const d = new Date(dropoff);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (p < today) return "Hentedato kan ikke være i fortiden";
  if (d <= p) return "Leveringsdato må være etter hentedato";
  return null;
}

export function BookingFlow({
  locations,
  initialCarSlug,
  initialLocationSlug,
  initialPickup,
  initialDropoff,
  initialStep,
}: {
  locations: LocationListItem[];
  initialCarSlug?: string;
  initialLocationSlug?: string;
  initialPickup?: string;
  initialDropoff?: string;
  initialStep?: Step;
}) {
  const defaultLocSlug = initialLocationSlug ?? locations[0]?.slug ?? "";
  const [step, setStep] = useState<Step>(
    initialStep ?? (initialCarSlug ? 3 : 1),
  );
  const [locationSlug, setLocationSlug] = useState(defaultLocSlug);
  const [pickup, setPickup] = useState(initialPickup ?? todayPlus(2));
  const [dropoff, setDropoff] = useState(initialDropoff ?? todayPlus(5));
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(
    initialCarSlug,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableCars, setAvailableCars] = useState<CarListItem[] | null>(null);
  const [loadingCars, setLoadingCars] = useState(false);

  // Restore form state from localStorage on mount (guards against refresh).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<{
        locationSlug: string;
        pickup: string;
        dropoff: string;
        selectedSlug: string;
        name: string;
        email: string;
        phone: string;
      }>;
      if (!initialCarSlug && saved.selectedSlug) setSelectedSlug(saved.selectedSlug);
      if (!initialLocationSlug && saved.locationSlug) setLocationSlug(saved.locationSlug);
      if (!initialPickup && saved.pickup) setPickup(saved.pickup);
      if (!initialDropoff && saved.dropoff) setDropoff(saved.dropoff);
      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ locationSlug, pickup, dropoff, selectedSlug, name, email, phone }),
    );
  }, [locationSlug, pickup, dropoff, selectedSlug, name, email, phone]);

  const selectedCar: CarListItem | undefined = useMemo(
    () =>
      (availableCars ?? []).find((c) => c.slug === selectedSlug) ?? undefined,
    [availableCars, selectedSlug],
  );
  const selectedLocation: LocationListItem | undefined = useMemo(
    () => locations.find((l) => l.slug === locationSlug),
    [locations, locationSlug],
  );

  const days = useMemo(() => daysBetween(pickup, dropoff), [pickup, dropoff]);
  const subtotal = selectedCar ? selectedCar.pricePerDay * days : 0;
  const delivery = 0;
  const total = subtotal + delivery;

  function goTo(next: Step) {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function loadAvailable() {
    setLoadingCars(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        pickup: new Date(pickup).toISOString(),
        dropoff: new Date(dropoff).toISOString(),
        location: locationSlug,
      });
      const res = await fetch(`/api/cars/available?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kunne ikke laste biler");
      setAvailableCars(data);
      goTo(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setLoadingCars(false);
    }
  }

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCar || !selectedLocation) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCar.id,
          pickupLocationId: selectedLocation.id,
          pickupAt: new Date(pickup).toISOString(),
          dropoffAt: new Date(dropoff).toISOString(),
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bestillingen feilet");

      window.localStorage.removeItem(STORAGE_KEY);

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.id }),
      });

      if (checkoutRes.ok) {
        const checkout = await checkoutRes.json();
        if (checkout.url) {
          window.location.href = checkout.url;
          return;
        }
      }
      window.location.href = `/booking/confirmation?reference=${data.reference}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
      setSubmitting(false);
    }
  }

  const dateError = isPickupValid(pickup, dropoff);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <Stepper current={step} />

        {step === 1 && (
          <div className="mt-10">
            <h2 className="headline-md">Hvor og når?</h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              Velg sted og datoer for å se tilgjengelige biler.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <Field label="Hentested">
                <select
                  value={locationSlug}
                  onChange={(e) => setLocationSlug(e.target.value)}
                  className="input"
                >
                  {locations.map((loc) => (
                    <option key={loc.slug} value={loc.slug}>
                      {loc.city}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hentedato">
                <input
                  type="date"
                  value={pickup}
                  min={todayIso()}
                  onChange={(e) => setPickup(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Leveringsdato">
                <input
                  type="date"
                  value={dropoff}
                  min={pickup || todayIso()}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            {dateError && (
              <p className="mt-4 text-sm text-red-700">{dateError}</p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-700">{error}</p>
            )}
            <div className="mt-8 flex items-center justify-end">
              <PrimaryButton
                onClick={loadAvailable}
                disabled={Boolean(dateError) || loadingCars}
              >
                {loadingCars ? "Laster …" : "Se ledige biler"}
              </PrimaryButton>
            </div>
            <div className="mt-6">
              <TrustRow />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10">
            <h2 className="headline-md">
              {availableCars?.length ?? 0} biler ledig
            </h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              {days} {days === 1 ? "dag" : "dager"} ·{" "}
              {selectedLocation?.city ?? locationSlug}
            </p>
            {availableCars && availableCars.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center">
                <p className="font-semibold">Ingen biler ledig disse datoene</p>
                <p className="mt-2 text-sm text-[color:var(--color-mute)]">
                  Prøv andre datoer eller et annet sted.
                </p>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="mt-5 rounded-full bg-[color:var(--color-ink)] px-5 py-2 text-sm font-medium text-white"
                >
                  Endre søket
                </button>
              </div>
            ) : (
              <ul className="mt-8 grid gap-4">
                {(availableCars ?? []).map((car) => {
                  const isSelected = selectedSlug === car.slug;
                  return (
                    <li key={car.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlug(car.slug);
                          goTo(3);
                        }}
                        className={`flex w-full items-center gap-5 rounded-2xl border bg-white p-4 text-left transition-colors ${
                          isSelected
                            ? "border-[color:var(--color-ink)]"
                            : "border-[color:var(--color-line)] hover:border-[color:var(--color-ink)]"
                        }`}
                      >
                        <div className="h-20 w-28 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={car.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[color:var(--color-mute)]">
                            {carCategoryLabel[car.category]}
                          </p>
                          <p className="mt-0.5 text-base font-semibold">
                            {car.brand} {car.model}
                          </p>
                          <p className="mt-1 text-xs text-[color:var(--color-mute)]">
                            {car.seats} seter ·{" "}
                            {transmissionLabel[car.transmission]} ·{" "}
                            {fuelLabel[car.fuel]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatKrPerDay(car.pricePerDay)}
                          </p>
                          <p className="text-xs text-[color:var(--color-mute)]">
                            {formatKr(car.pricePerDay * days)} totalt
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-8">
              <BackButton onClick={() => goTo(1)} />
            </div>
          </div>
        )}

        {step === 3 && selectedCar && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goTo(4);
            }}
            className="mt-10"
          >
            <h2 className="headline-md">Kontaktinformasjon</h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              Vi bruker dette til å bekrefte bestillingen og varsle om levering.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Fullt navn">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ola Nordmann"
                  className="input"
                />
              </Field>
              <Field label="E-post">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ola@example.no"
                  className="input"
                />
              </Field>
              <Field label="Telefon">
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+47 000 00 000"
                  pattern="^(\\+47\\s?)?[0-9\\s]{8,}$"
                  className="input"
                />
              </Field>
            </div>
            <p className="mt-6 text-xs text-[color:var(--color-mute)]">
              Ved å fortsette godtar du{" "}
              <Link href="/vilkar" className="underline">
                Rento sine vilkår
              </Link>{" "}
              og{" "}
              <Link href="/personvern" className="underline">
                personvernerklæringen
              </Link>
              .
            </p>
            <div className="mt-8 flex items-center justify-between gap-4">
              <BackButton onClick={() => goTo(2)} />
              <PrimaryButton>Gå til betaling</PrimaryButton>
            </div>
          </form>
        )}

        {step === 4 && selectedCar && (
          <form onSubmit={handleConfirm} className="mt-10">
            <h2 className="headline-md">Betaling</h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              Betal sikkert. Beløpet reserveres ved booking og trekkes når bilen er hentet.
            </p>
            <div className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <dl className="space-y-3 text-sm">
                <Row label="Bil" value={`${selectedCar.brand} ${selectedCar.model}`} />
                <Row label="Sted" value={selectedLocation?.city ?? ""} />
                <Row label="Hentedato" value={pickup} />
                <Row label="Leveringsdato" value={dropoff} />
                <Row
                  label="Varighet"
                  value={`${days} ${days === 1 ? "dag" : "dager"}`}
                />
                <div className="flex items-center justify-between border-t border-[color:var(--color-line)] pt-3 text-base font-semibold">
                  <span>Totalt</span>
                  <span>{formatKr(total)}</span>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex items-center justify-center gap-5 text-xs text-[color:var(--color-mute)]">
              <span>Vipps</span>
              <span aria-hidden>·</span>
              <span>Visa</span>
              <span aria-hidden>·</span>
              <span>Mastercard</span>
              <span aria-hidden>·</span>
              <span>256-bit kryptering</span>
            </div>

            {error && (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <BackButton onClick={() => goTo(3)} disabled={submitting} />
              <PrimaryButton disabled={submitting}>
                {submitting ? "Sender …" : `Betal ${formatKr(total)}`}
              </PrimaryButton>
            </div>
          </form>
        )}

        {(step === 3 || step === 4) && !selectedCar && (
          <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
            <p>Ingen bil valgt.</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => goTo(1)}
                className="rounded-full border border-[color:var(--color-line)] bg-white px-5 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              >
                Start fra begynnelsen
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Summary
          car={selectedCar}
          days={days}
          subtotal={subtotal}
          delivery={delivery}
          total={total}
          pickup={pickup}
          dropoff={dropoff}
          locationName={selectedLocation?.city ?? locationSlug}
        />
      </aside>

      <style>{`
        .input {
          display: block;
          width: 100%;
          border: 1px solid var(--color-line);
          border-radius: 14px;
          padding: 0 16px;
          height: 48px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-ink);
          background: #fff;
          transition: border-color .15s ease;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-ink);
        }
      `}</style>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={disabled}
      className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function BackButton({
  onClick,
  label = "← Tilbake",
  disabled,
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-sm font-medium text-[color:var(--color-mute)] hover:text-[color:var(--color-ink)] disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stepper({ current }: { current: Step }) {
  const steps: Step[] = [1, 2, 3, 4];
  const percent = ((current - 1) / (steps.length - 1)) * 100;

  return (
    <div>
      {/* Mobile: progress bar + current label only */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between text-xs text-[color:var(--color-mute)]">
          <span>
            Steg {current} av {steps.length}
          </span>
          <span className="font-medium text-[color:var(--color-ink)]">
            {stepLabels[current]}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color:var(--color-fog)]">
          <div
            className="h-full rounded-full bg-[color:var(--color-ink)] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden items-center gap-3 text-xs text-[color:var(--color-mute)] md:flex">
        {steps.map((s, idx) => {
          const isCurrent = s === current;
          const isDone = s < current;
          return (
            <li key={s} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                  isCurrent
                    ? "bg-[color:var(--color-ink)] text-white"
                    : isDone
                      ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                      : "bg-[color:var(--color-fog)] text-[color:var(--color-mute)]"
                }`}
              >
                {s}
              </span>
              <span
                className={
                  isCurrent
                    ? "font-medium text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-mute)]"
                }
              >
                {stepLabels[s]}
              </span>
              {idx < steps.length - 1 && (
                <span aria-hidden className="h-px w-6 bg-[color:var(--color-line)]" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Summary({
  car,
  days,
  subtotal,
  delivery,
  total,
  pickup,
  dropoff,
  locationName,
}: {
  car?: CarListItem;
  days: number;
  subtotal: number;
  delivery: number;
  total: number;
  pickup: string;
  dropoff: string;
  locationName: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
      <p className="eyebrow">Oppsummering</p>
      {car ? (
        <div className="mt-4 flex items-center gap-4">
          <div className="h-16 w-24 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={car.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {car.brand} {car.model}
            </p>
            <p className="text-xs text-[color:var(--color-mute)]">
              {carCategoryLabel[car.category]}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[color:var(--color-mute)]">
          Ingen bil valgt enda.
        </p>
      )}

      <dl className="mt-6 space-y-3 border-t border-[color:var(--color-line)] pt-5 text-sm">
        <Row label="Sted" value={locationName} />
        <Row label="Hentedato" value={pickup} />
        <Row label="Levering" value={dropoff} />
        <Row label="Varighet" value={`${days} ${days === 1 ? "dag" : "dager"}`} />
      </dl>

      {car && (
        <dl className="mt-5 space-y-2 border-t border-[color:var(--color-line)] pt-5 text-sm">
          <Row
            label={`${formatKrPerDay(car.pricePerDay)} × ${days}`}
            value={formatKr(subtotal)}
          />
          <Row
            label="Levering"
            value={delivery === 0 ? "Gratis" : formatKr(delivery)}
          />
          <div className="mt-2 flex items-center justify-between border-t border-[color:var(--color-line)] pt-3 text-base font-semibold">
            <span>Totalt</span>
            <span>{formatKr(total)}</span>
          </div>
        </dl>
      )}

      <p className="mt-5 text-xs text-[color:var(--color-mute)]">
        Forsikring og veihjelp inkludert · Fri avbestilling inntil 48 t
      </p>
      {!car && (
        <div className="mt-5">
          <Link
            href="/cars"
            className="text-sm font-medium text-[color:var(--color-ink)] underline-offset-4 hover:underline"
          >
            Bla gjennom biler →
          </Link>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[color:var(--color-mute)]">{label}</dt>
      <dd className="font-medium text-[color:var(--color-ink)]">{value}</dd>
    </div>
  );
}
