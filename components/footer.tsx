"use client"

import Link from "next/link"
import { Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/20">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <Link href="/" className="text-2xl font-heading font-bold hover:text-white/80 transition-all glow-text">
            Nemesis
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
            Plateforme communautaire esports française de référence.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <h3 className="font-heading font-semibold text-white text-sm glow-text">Navigation</h3>
          <div className="flex flex-col space-y-1 text-xs">
            <Link href="/explorer" className="hover:text-indigo-400 transition-all duration-200">Explorer</Link>
            <Link href="/equipes" className="hover:text-indigo-400 transition-all duration-200">Équipes</Link>
            <Link href="/joueurs" className="hover:text-indigo-400 transition-all duration-200">Joueurs</Link>
            <Link href="/recrutement" className="hover:text-indigo-400 transition-all duration-200">Recrutement</Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <h3 className="font-heading font-semibold text-white text-sm glow-text">Support</h3>
          <div className="flex flex-col space-y-1 text-xs">
            <Link href="/credits" className="hover:text-indigo-400 transition-all duration-200">Crédits</Link>
            <Link href="#" className="hover:text-indigo-400 transition-all duration-200">Contact</Link>
            <Link href="#" className="hover:text-indigo-400 transition-all duration-200">FAQ</Link>
            <Link href="#" className="hover:text-indigo-400 transition-all duration-200">Règlement</Link>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <h3 className="font-heading font-semibold text-white text-sm glow-text">Réseaux sociaux</h3>
          <div className="flex space-x-2 justify-center md:justify-start">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 transition-all duration-200"
              aria-label="Discord"
            >
              <Discord className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom centré */}
      <div className="border-t border-white/20 mt-8 py-4 flex flex-col items-center text-xs text-gray-400 space-y-1">
        <p>© 2025 Nemesis Esports. Tous droits réservés.</p>
        <p>Version 1.0.0</p>
      </div>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
        }
      `}</style>
    </footer>
  )
}
