import { getAllBookings } from "@/server/bookings";
import { formatDate, formatKr } from "@/lib/format";
import { BookingStatusSelect } from "./BookingStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div>
      <h1 className="headline-md">Bestillinger</h1>
      <p className="mt-2 text-sm text-[color:var(--color-mute)]">
        {bookings.length} totalt
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
            <tr className="border-b border-[color:var(--color-line)]">
              <th className="py-3">Ref</th>
              <th className="py-3">Bil</th>
              <th className="py-3">Kunde</th>
              <th className="py-3">Periode</th>
              <th className="py-3 text-right">Totalt</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-[color:var(--color-line)]">
                <td className="py-3 font-mono text-xs">{b.reference}</td>
                <td className="py-3">
                  {b.car.brand} {b.car.model}
                </td>
                <td className="py-3">
                  <p>{b.user?.name ?? b.guestName}</p>
                  <p className="text-xs text-[color:var(--color-mute)]">
                    {b.user?.email ?? b.guestEmail}
                  </p>
                </td>
                <td className="py-3 text-xs">
                  {formatDate(b.pickupAt)} – {formatDate(b.dropoffAt)}
                </td>
                <td className="py-3 text-right font-medium">{formatKr(b.total)}</td>
                <td className="py-3">
                  <BookingStatusSelect id={b.id} current={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
          Ingen bestillinger ennå.
        </div>
      )}
    </div>
  );
}
