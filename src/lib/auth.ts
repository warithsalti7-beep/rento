import type { Provider } from "next-auth/providers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const isProduction = process.env.NODE_ENV === "production";

const providers: Provider[] = [];

// Magic-link email. In production we need a real SMTP (EMAIL_SERVER).
// In dev with no SMTP configured we still register the provider but
// print the magic link to the server console so developers can sign
// in without setting anything up.
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  );
} else if (!isProduction) {
  providers.push(
    Nodemailer({
      server: {
        host: "localhost",
        port: 25,
        auth: { user: "dev", pass: "dev" },
      },
      from: "Rento Dev <dev@localhost>",
      sendVerificationRequest: async ({ identifier, url }) => {
        // eslint-disable-next-line no-console
        console.log(
          [
            "",
            "────────────────── 🔑 Rento magic link ──────────────────",
            `For: ${identifier}`,
            `Link: ${url}`,
            "──────────────────────────────────────────────────────────",
            "",
          ].join("\n"),
        );
      },
    }),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const hasAnyProvider = providers.length > 0;
export const hasEmailProvider = providers.some((p) => {
  const id = typeof p === "function" ? undefined : (p as { id?: string }).id;
  return id === "nodemailer";
});
export const hasGoogleProvider = providers.some((p) => {
  const id = typeof p === "function" ? undefined : (p as { id?: string }).id;
  return id === "google";
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
    error: "/auth/sign-in",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-expect-error augmenting session with role
        session.user.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return session;
    },
  },
});
