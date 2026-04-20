import type { Metadata } from "next";
import Link from "next/link";
import {
  hasAnyProvider,
  hasEmailProvider,
  hasGoogleProvider,
  signIn,
} from "@/lib/auth";

export const metadata: Metadata = { title: "Logg inn" };

type SignInProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage(props: SignInProps) {
  const params = await props.searchParams;
  const errorCode = typeof params?.error === "string" ? params.error : null;
  const callback =
    typeof params?.callbackUrl === "string" ? params.callbackUrl : "/account";

  const errorText = errorCode
    ? errorMap[errorCode] ?? "Innlogging feilet. Prøv igjen."
    : null;

  if (!hasAnyProvider) {
    return (
      <section>
        <div className="container-x pt-14 pb-20 md:pt-20">
          <div className="mx-auto max-w-md">
            <p className="eyebrow">Logg inn</p>
            <h1 className="headline-lg mt-3">Midlertidig utilgjengelig</h1>
            <p className="mt-3 text-[color:var(--color-mute)]">
              Innlogging er ikke konfigurert ennå. Kontakt oss på{" "}
              <a href="mailto:hei@rentobil.no" className="underline">
                hei@rentobil.no
              </a>{" "}
              så hjelper vi deg med bestillingen.
            </p>
            <div className="mt-6 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-fog)] p-4 text-xs text-[color:var(--color-mute)]">
              <strong className="block text-[color:var(--color-ink)]">
                For admin:
              </strong>
              Sett <code>EMAIL_SERVER</code> + <code>EMAIL_FROM</code> eller{" "}
              <code>GOOGLE_CLIENT_ID</code> + <code>GOOGLE_CLIENT_SECRET</code>{" "}
              i miljøvariablene på Vercel og redeploy.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container-x pt-14 pb-20 md:pt-20">
        <div className="mx-auto max-w-md">
          <p className="eyebrow">Logg inn</p>
          <h1 className="headline-lg mt-3">Velkommen til Rento</h1>
          <p className="mt-3 text-[color:var(--color-mute)]">
            Logg inn for å se og administrere bestillingene dine.
          </p>

          {errorText && (
            <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorText}
            </p>
          )}

          {hasGoogleProvider && (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callback });
              }}
              className="mt-8"
            >
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[color:var(--color-line)] bg-white px-5 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              >
                <GoogleIcon />
                Fortsett med Google
              </button>
            </form>
          )}

          {hasGoogleProvider && hasEmailProvider && (
            <div className="my-6 flex items-center gap-3 text-xs text-[color:var(--color-mute)]">
              <span className="h-px flex-1 bg-[color:var(--color-line)]" />
              eller
              <span className="h-px flex-1 bg-[color:var(--color-line)]" />
            </div>
          )}

          {hasEmailProvider && (
            <form
              action={async (formData) => {
                "use server";
                const email = String(formData.get("email") ?? "").trim();
                if (!email) return;
                await signIn("nodemailer", { email, redirectTo: callback });
              }}
              className={hasGoogleProvider ? "" : "mt-8"}
            >
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
                  E-post
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="din@epost.no"
                  className="h-12 w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 text-sm font-medium text-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="mt-3 h-12 w-full rounded-full bg-[color:var(--color-ink)] px-5 text-sm font-medium text-white hover:bg-black"
              >
                Send innloggingslenke
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-[color:var(--color-mute)]">
            Ved å fortsette godtar du{" "}
            <Link href="/vilkar" className="underline">
              vilkårene
            </Link>{" "}
            og{" "}
            <Link href="/personvern" className="underline">
              personvernerklæringen
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

const errorMap: Record<string, string> = {
  Configuration: "Innlogging er ikke riktig konfigurert. Kontakt oss.",
  AccessDenied: "Innlogging ble avvist.",
  Verification: "Lenken er utløpt eller allerede brukt. Be om en ny.",
  OAuthSignin: "Kunne ikke koble til leverandøren. Prøv igjen.",
  OAuthCallback: "Noe gikk galt under innlogging. Prøv igjen.",
  EmailSignin: "Klarte ikke å sende e-post. Prøv igjen eller kontakt oss.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M16.51 8.18c0-.56-.05-1.1-.15-1.62H9v3.08h4.2c-.18.97-.73 1.79-1.56 2.34v1.94h2.52c1.47-1.36 2.35-3.36 2.35-5.74Z"
        fill="#4285F4"
      />
      <path
        d="M9 17c2.1 0 3.87-.7 5.16-1.88l-2.52-1.94c-.7.47-1.59.75-2.64.75-2.03 0-3.75-1.37-4.37-3.21H1.03v2A7.999 7.999 0 0 0 9 17Z"
        fill="#34A853"
      />
      <path
        d="M4.63 10.72a4.77 4.77 0 0 1 0-3.06V5.66H1.03a8 8 0 0 0 0 6.68l3.6-2.62Z"
        fill="#FBBC05"
      />
      <path
        d="M9 4.77c1.15 0 2.17.4 2.98 1.17l2.23-2.23C12.87 2.48 11.1 1.8 9 1.8A8 8 0 0 0 1.03 5.66l3.6 2.62C5.25 6.45 6.97 4.77 9 4.77Z"
        fill="#EA4335"
      />
    </svg>
  );
}
