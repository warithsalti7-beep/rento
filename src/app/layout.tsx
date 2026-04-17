import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "Rento – Lei bil. Enkelt.",
    template: "%s · Rento",
  },
  description:
    "Book bil på sekunder og få den levert til døren. Rento gjør bilutleie enkelt i hele Norge.",
  metadataBase: new URL("https://rentobil.no"),
  openGraph: {
    title: "Rento – Lei bil. Enkelt.",
    description:
      "Book bil på sekunder og få den levert til døren. Rento gjør bilutleie enkelt i hele Norge.",
    locale: "nb_NO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body className="min-h-screen bg-[color:var(--color-paper)] font-sans text-[color:var(--color-ink)] antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
