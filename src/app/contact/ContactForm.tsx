"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic"),
          body: data.get("body"),
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? "Kunne ikke sende melding");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    }
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
            name="name"
            type="text"
            placeholder="Ditt navn"
            className="input"
          />
        </Field>
        <Field label="E-post">
          <input
            required
            name="email"
            type="email"
            placeholder="din@epost.no"
            className="input"
          />
        </Field>
        <Field label="Tema" full>
          <select name="topic" className="input" defaultValue="Generell henvendelse">
            <option>Generell henvendelse</option>
            <option>Bestilling</option>
            <option>Samarbeid</option>
            <option>Bedrift</option>
          </select>
        </Field>
        <Field label="Melding" full>
          <textarea
            required
            name="body"
            rows={5}
            placeholder="Hvordan kan vi hjelpe?"
            className="input h-auto py-3"
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {status === "sending" ? "Sender …" : "Send melding"}
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
