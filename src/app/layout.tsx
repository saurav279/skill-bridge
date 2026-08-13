import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import Whatsapp from "@/components/layout/whatsapp";
import { company } from "@/data/company";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = company.website;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1201FE" },
    { media: "(prefers-color-scheme: dark)", color: "#1201FE" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Skill Bridge — Global Talent Visa Consultancy",
    template: "%s · Skill Bridge",
  },
  description:
    "Evidence-driven Global Talent Visa consultancy for founders, engineers, researchers, designers, and creators. Premium strategy — not immigration mill processing.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Skill Bridge",
    title: "Skill Bridge — Global Talent Visa Consultancy",
    description:
      "Helping exceptional individuals secure Global Talent Visas with evidence-driven strategies.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Skill Bridge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Bridge — Global Talent Visa Consultancy",
    description:
      "Helping exceptional individuals secure Global Talent Visas with evidence-driven strategies.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/fav/favicon.ico" },
      { url: "/fav/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/fav/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/fav/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "android-chrome",
        url: "/fav/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/fav/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/fav/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: company.name,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: company.email,
      telephone: company.phone,
      address: company.address,
      description:
        "Premium Global Talent Visa consultancy offering evidence-driven strategies for exceptional talent.",
      sameAs: Object.values(company.socialLinks),
    },
    {
      "@type": "WebSite",
      name: company.name,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/case-studies`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="skill-bridge-theme"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Whatsapp />
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
