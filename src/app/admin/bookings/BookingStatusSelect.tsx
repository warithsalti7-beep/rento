"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "../actions";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "CANCELLED",
  "COMPLETED",
] as const;

type Status = (typeof statuses)[number];

export function BookingStatusSelect({
  id,
  current,
}: {
  id: string;
  current: Status;
}) {
  const [pending, start] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as Status;
        start(() => updateBookingStatus(id, next));
      }}
      className="rounded-full border border-[color:var(--color-line)] bg-white px-3 py-1 text-xs disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
