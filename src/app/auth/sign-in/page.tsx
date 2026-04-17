import type { Metadata } from "next";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = { title: "Logg inn" };

export default function SignInPage() {
  return (
    <section>
      <div className="container-x pt-14 pb-20 md:pt-20">
        <div className="mx-auto max-w-md">
          <p className="eyebrow">Logg inn</p>
          <h1 className="headline-lg mt-3">Velkommen til Rento</h1>
          <p className="mt-3 text-[color:var(--color-mute)]">
            Vi sender deg en innloggingslenke på e-post. Ingen passord.
          </p>

          <form
            action={async (formData) => {
              "use server";
              const email = String(formData.get("email") ?? "");
              await signIn("nodemailer", { email, redirectTo: "/account" });
            }}
            className="mt-8 flex flex-col gap-3"
          >
            <input
              required
              type="email"
              name="email"
              placeholder="din@epost.no"
              className="h-12 rounded-2xl border border-[color:var(--color-line)] bg-white px-4 text-sm font-medium text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-[color:var(--color-ink)] px-7 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Send innloggingslenke
            </button>
          </form>

          {process.env.GOOGLE_CLIENT_ID && (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/account" });
              }}
              className="mt-3"
            >
              <button
                type="submit"
                className="h-12 w-full rounded-full border border-[color:var(--color-line)] bg-white px-7 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              >
                Fortsett med Google
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-[color:var(--color-mute)]">
            Ved å fortsette godtar du Rento sine vilkår og personvern.
          </p>
        </div>
      </div>
    </section>
  );
}
