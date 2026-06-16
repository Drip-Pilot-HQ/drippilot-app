import type { Metadata, Viewport } from "next";
import { Poppins, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "../store/server/queryProvider";
import { AuthProvider } from "../components/auth/AuthProvider";
import { ConfirmProvider } from "../components/branding/ConfirmProvider";
import { Toaster } from "sonner";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { CrispProvider } from "@/components/providers/CrispProvider";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans-pro",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#fb923c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://drippilot.com"),
  title: {
    default: "Drip Pilot - AI-Powered Sales Assistant",
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
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/ios/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Drip Pilot",
    statusBarStyle: "default",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drippilot.com",
    siteName: "Drip Pilot",
    title: "Drip Pilot - AI-Powered Sales Assistant",
    description:
      "Automate your outreach, engage leads instantly, and close deals faster with Drip Pilot.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drip Pilot - AI-Powered Sales Assistant",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Drip Pilot - AI-Powered Sales Assistant",
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
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/ios/apple-touch-icon.png" />

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8GGT71HK31"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8GGT71HK31');
            `,
          }}
        />

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
        className={`${sourceSans.variable} ${poppins.variable} font-sans antialiased bg-white text-slate-900`}
      >
        <ServiceWorkerRegistrar />
        <CrispProvider />
        <TanstackQueryProvider>
          <AuthProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </AuthProvider>
        </TanstackQueryProvider>
        <Toaster position="top-right" expand={false} richColors />
      </body>
    </html>
  );
}
