import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Oversikt" },
  { href: "/admin/cars", label: "Biler" },
  { href: "/admin/bookings", label: "Bestillinger" },
  { href: "/admin/locations", label: "Lokasjoner" },
  { href: "/admin/pricing", label: "Priser" },
  { href: "/admin/messages", label: "Meldinger" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") {
    return (
      <section>
        <div className="container-x py-20">
          <h1 className="headline-lg">Ingen tilgang</h1>
          <p className="mt-3 text-[color:var(--color-mute)]">
            Denne siden er kun for administratorer.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[color:var(--color-fog)] min-h-[calc(100vh-64px)]">
      <div className="container-x grid gap-8 py-10 md:grid-cols-[220px_1fr]">
        <aside>
          <p className="eyebrow">Admin</p>
          <nav aria-label="Adminmeny" className="mt-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6 md:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
