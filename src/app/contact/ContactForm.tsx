"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8">
        <h3 className="headline-md">Takk for meldingen</h3>
        <p className="mt-3 text-[color:var(--color-mute)]">
          Vi svarer vanligvis innen én arbeidsdag.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Navn">
          <input
            required
            type="text"
            placeholder="Ditt navn"
            className="input"
          />
        </Field>
        <Field label="E-post">
          <input
            required
            type="email"
            placeholder="din@epost.no"
            className="input"
          />
        </Field>
        <Field label="Tema" full>
          <select className="input">
            <option>Generell henvendelse</option>
            <option>Bestilling</option>
            <option>Samarbeid</option>
            <option>Bedrift</option>
          </select>
        </Field>
        <Field label="Melding" full>
          <textarea
            required
            rows={5}
            placeholder="Hvordan kan vi hjelpe?"
            className="input h-auto py-3"
          />
        </Field>
      </div>
      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          Send melding
        </button>
      </div>
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
        }
        textarea.input { height: auto; }
        .input:focus { outline: none; border-color: var(--color-ink); }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
        {label}
      </span>
      {children}
    </label>
  );
}
