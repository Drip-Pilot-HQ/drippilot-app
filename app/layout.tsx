import type { Metadata } from "next";
import { Domine, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans-pro",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drippilot.com"),
  title: {
    default: "Drip Pilot — AI-Powered Sales Automation",
    template: "%s | Drip Pilot",
  },
  description:
    "Automate your outreach, engage leads instantly, and close deals faster with Drip Pilot — the AI-powered drip campaign platform for high-growth sales teams.",
  keywords: [
    "drip campaigns",
    "sales automation",
    "AI outreach",
    "email automation",
    "CRM integration",
  ],
  robots: { index: true, follow: true },
  icons: { icon: "/assets/favicon.ico" },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drippilot.com",
    siteName: "Drip Pilot",
    title: "Drip Pilot — AI-Powered Sales Automation",
    description:
      "Automate your outreach, engage leads instantly, and close deals faster with Drip Pilot.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drip Pilot — AI-Powered Sales Automation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Drip Pilot — AI-Powered Sales Automation",
    description: "Automate your outreach and close more deals with AI.",
    images: ["/assets/og-image.png"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Drip Pilot",
  url: "https://drippilot.com",
  logo: "https://drippilot.com/assets/logo.png",
  sameAs: [
    "https://twitter.com/drippilot",
    "https://linkedin.com/company/drippilot",
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Drip Pilot",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      </head>
      <body
        className={`${sourceSans.variable} ${domine.variable} font-sans antialiased bg-white text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
