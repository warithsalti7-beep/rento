import { prisma } from "@/lib/prisma";
import { updatePricingTier } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const tiers = await prisma.pricingTier.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="headline-md">Priser</h1>
      <p className="mt-2 text-sm text-[color:var(--color-mute)]">
        Endringer slår inn umiddelbart på pris- og forside.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <form
            key={tier.id}
            action={updatePricingTier}
            className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-line)] p-5"
          >
            <input type="hidden" name="id" value={tier.id} />
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Navn
              </span>
              <input
                name="name"
                defaultValue={tier.name}
                className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Undertekst
              </span>
              <input
                name="tagline"
                defaultValue={tier.tagline}
                className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Pris fra (kr/mnd)
              </span>
              <input
                name="priceFromMonth"
                type="number"
                defaultValue={tier.priceFromMonth}
                className="h-11 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="highlight"
                type="checkbox"
                defaultChecked={tier.highlight}
              />
              Fremhev som «Mest valgt»
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--color-mute)]">
                Inkluderer (en per linje)
              </span>
              <textarea
                name="includes"
                rows={5}
                defaultValue={tier.includes.join("\n")}
                className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm"
              />
            </label>
            <button className="h-11 rounded-full bg-[color:var(--color-ink)] px-5 text-sm font-medium text-white hover:bg-black">
              Lagre
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
