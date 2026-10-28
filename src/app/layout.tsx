import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";

import { site } from "@/shared/config";
import { JsonLd, organizationJsonLd } from "@/shared/lib/seo";
import { SkipLink } from "@/shared/ui";
import { QuoteShortcut } from "@/widgets/quote-shortcut";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";

import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.legalName, template: "%s | FMECC" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: "en",
    title: site.legalName,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body id="top">
        <SkipLink />
        {/* Every page opens with a dark hero, so the header overlays it. */}
        <SiteHeader variant="overlay" />
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <QuoteShortcut />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
