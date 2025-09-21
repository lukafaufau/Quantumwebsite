"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Diamond as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreditsPage() {
  const [showMore, setShowMore] = useState(false)

  const contributors = [
    "Alice", "Bob", "Charlie", "David", "Eve"
  ]

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Crédits</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
          Merci à toutes les personnes qui ont contribué au développement et au succès de Nemesis Esports.
        </p>

        <section className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">Contributeurs</h2>
          <ul className="space-y-2 text-center">
            {contributors.slice(0, showMore ? contributors.length : 3).map((name, i) => (
              <li key={i} className="text-white/80">{name}</li>
            ))}
          </ul>
          {contributors.length > 3 && (
            <div className="flex justify-center mt-4">
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Voir moins" : "Voir tous"}
              </Button>
            </div>
          )}
        </section>

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Nous suivre</h2>
          <div className="flex justify-center space-x-4">
            <Link href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Discord className="h-6 w-6" />
              Discord
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
