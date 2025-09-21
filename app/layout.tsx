import type React from "react"
import type { Metadata } from "next"
import { Poppins, DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Nemesis - Esports Community",
  description: "Plateforme communautaire esport française - Gestion d'équipes, recrutement et tournois",
  generator: "v0.app",
  keywords: ["esport", "gaming", "communauté", "équipes", "tournois", "recrutement", "france"],
  authors: [
    { name: "Wayzze", url: "https://nemesis.gg" },
    { name: "16k", url: "https://nemesis.gg" },
  ],
  creator: "Nemesis Team",
  publisher: "Nemesis Esports",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://nemesis-esports.netlify.app",
    title: "Nemesis - Esports Community",
    description: "Plateforme communautaire esport française",
    siteName: "Nemesis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nemesis - Esports Community",
    description: "Plateforme communautaire esport française",
    creator: "@nemesis_esports",
  },
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#000000",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`font-sans ${poppins.variable} ${dmSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
