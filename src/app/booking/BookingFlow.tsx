"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LinkButton } from "@/components/Button";
import { cars, findCar, type Car } from "@/data/cars";
import { locations } from "@/data/locations";
import { formatKr, formatKrPerDay } from "@/lib/format";

type Step = 1 | 2 | 3 | 4;

const stepLabels: Record<Step, string> = {
  1: "Sted og dato",
  2: "Velg bil",
  3: "Bekreft",
  4: "Betaling",
};

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

export function BookingFlow({ initialCarSlug }: { initialCarSlug?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialCarSlug ? 3 : 1);
  const [location, setLocation] = useState(locations[0].slug);
  const [pickup, setPickup] = useState(todayPlus(2));
  const [dropoff, setDropoff] = useState(todayPlus(5));
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(
    initialCarSlug,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const selectedCar: Car | undefined = useMemo(
    () => (selectedSlug ? findCar(selectedSlug) : undefined),
    [selectedSlug],
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

  function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCar) return;
    const params = new URLSearchParams({
      car: selectedCar.slug,
      location,
      pickup,
      dropoff,
      days: String(days),
      total: String(total),
      name,
    });
    router.push(`/booking/confirmation?${params.toString()}`);
  }

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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  onChange={(e) => setPickup(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Leveringsdato">
                <input
                  type="date"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <div className="mt-8 flex items-center justify-end">
              <button
                type="button"
                onClick={() => goTo(2)}
                className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Se biler
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10">
            <h2 className="headline-md">Velg bil</h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              {days} {days === 1 ? "dag" : "dager"} · {locationName(location)}
            </p>
            <ul className="mt-8 grid gap-4">
              {cars.map((car) => {
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
                          {car.category}
                        </p>
                        <p className="mt-0.5 text-base font-semibold">
                          {car.brand} {car.model}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--color-mute)]">
                          {car.seats} seter · {car.transmission} · {car.fuel}
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
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goTo(1)}
                className="text-sm font-medium text-[color:var(--color-mute)] hover:text-[color:var(--color-ink)]"
              >
                ← Tilbake
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedCar && (
          <form onSubmit={handleConfirm} className="mt-10">
            <h2 className="headline-md">Bekreft detaljer</h2>
            <p className="mt-2 text-[color:var(--color-mute)]">
              Kontaktinformasjon til bekreftelse og levering.
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
                  className="input"
                />
              </Field>
              <Field label="Hentested">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  onChange={(e) => setPickup(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Leveringsdato">
                <input
                  type="date"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <p className="mt-6 text-xs text-[color:var(--color-mute)]">
              Ved å fortsette godtar du Rento sine vilkår. Betaling trekkes ikke før bilen er hentet.
            </p>
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goTo(2)}
                className="text-sm font-medium text-[color:var(--color-mute)] hover:text-[color:var(--color-ink)]"
              >
                ← Tilbake
              </button>
              <button
                type="submit"
                className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Gå til betaling
              </button>
            </div>
          </form>
        )}

        {step === 3 && !selectedCar && (
          <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
            <p>Ingen bil valgt.</p>
            <div className="mt-4">
              <LinkButton href="/cars" variant="secondary">
                Gå til bilutvalg
              </LinkButton>
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
          locationSlug={location}
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
  return (
    <ol className="flex items-center gap-3 text-xs text-[color:var(--color-mute)]">
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
  locationSlug,
}: {
  car?: Car;
  days: number;
  subtotal: number;
  delivery: number;
  total: number;
  pickup: string;
  dropoff: string;
  locationSlug: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
      <p className="eyebrow">Oppsummering</p>
      {car ? (
        <div className="mt-4 flex items-center gap-4">
          <div className="h-16 w-24 overflow-hidden rounded-xl bg-[color:var(--color-fog)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={car.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {car.brand} {car.model}
            </p>
            <p className="text-xs text-[color:var(--color-mute)]">{car.category}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[color:var(--color-mute)]">Ingen bil valgt enda.</p>
      )}

      <dl className="mt-6 space-y-3 border-t border-[color:var(--color-line)] pt-5 text-sm">
        <Row label="Sted" value={locationName(locationSlug)} />
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
          <Row label="Levering" value={delivery === 0 ? "Gratis" : formatKr(delivery)} />
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

function locationName(slug: string) {
  return locations.find((l) => l.slug === slug)?.city ?? slug;
}
