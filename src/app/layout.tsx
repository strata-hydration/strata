import type { Metadata } from "next";
import {
  Manrope,
  Sora,
  Inter,
  Space_Grotesk,
  DM_Sans,
  Syne,
  Outfit,
  Caveat,
  Bebas_Neue,
} from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "STRATA HYDRATION | Electrolyte Drink Mix",
  description: "Electrolyte powered hydration designed for daily performance. No Added Sugar, 5 kcal, and 1540 mg electrolytes per stick. Fuel your day with STRATA Hydration.",
  keywords: ["hydration", "electrolyte", "drink mix", "citrus lime", "no added sugar", "vegan"],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${sora.variable} ${inter.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${syne.variable} ${outfit.variable} ${caveat.variable} ${bebasNeue.variable} antialiased`}
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
