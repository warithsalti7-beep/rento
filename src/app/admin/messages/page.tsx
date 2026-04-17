import { prisma } from "@/lib/prisma";
import { markMessageHandled } from "../actions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="headline-md">Meldinger</h1>
      <p className="mt-2 text-sm text-[color:var(--color-mute)]">
        {messages.filter((m) => !m.handled).length} ubehandlede av {messages.length}
      </p>

      <ul className="mt-6 space-y-4">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="rounded-2xl border border-[color:var(--color-line)] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{msg.name}</p>
                <p className="text-xs text-[color:var(--color-mute)]">
                  {msg.email} · {msg.topic} · {formatDate(msg.createdAt)}
                </p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await markMessageHandled(msg.id, !msg.handled);
                }}
              >
                <button className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-xs hover:border-[color:var(--color-ink)]">
                  {msg.handled ? "Marker som ubehandlet" : "Marker som behandlet"}
                </button>
              </form>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{msg.body}</p>
          </li>
        ))}
      </ul>

      {messages.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-line)] p-10 text-center text-[color:var(--color-mute)]">
          Ingen meldinger ennå.
        </div>
      )}
    </div>
  );
}
