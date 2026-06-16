import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://lumera-wellness.vercel.app";
const defaultTitle = "Lumera Wellness | Premium Massage & Wellness Studio";
const defaultDescription =
  "Lumera Wellness is a premium massage and wellness studio offering relaxing, therapeutic, and body treatments in a serene setting. Book your escape today.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Lumera Wellness",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: "Lumera Wellness",
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    // TODO: add /public/og-image.jpg (1200x630) for richer link previews
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  alternates: { canonical: "/" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}