"use client"

import Link from "next/link"
import { Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/20">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between gap-8 md:gap-0">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <Link href="/" className="text-2xl font-heading font-bold hover:text-white/80 transition-all">
            Nemesis
          </Link>
          <p className="text-sm text-gray-400 max-w-xs">
            La plateforme communautaire esport française de référence.
          </p>
          <div className="flex space-x-4 mt-2">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <Discord className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <h3 className="font-semibold">Navigation</h3>
          <div className="flex flex-col space-y-1 text-sm">
            <Link href="/explorer" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/equipes" className="hover:text-white transition-colors">Équipes</Link>
            <Link href="/joueurs" className="hover:text-white transition-colors">Joueurs</Link>
            <Link href="/recrutement" className="hover:text-white transition-colors">Recrutement</Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <h3 className="font-semibold">Support</h3>
          <div className="flex flex-col space-y-1 text-sm">
            <Link href="/credits" className="hover:text-white transition-colors">Crédits</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="#" className="hover:text-white transition-colors">Règlement</Link>
          </div>
        </div>

        {/* Légal */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <h3 className="font-semibold">Légal</h3>
          <div className="flex flex-col space-y-1 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </div>

      {/* Bas de page centré */}
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>© 2025 Nemesis Esports. Tous droits réservés.</p>
        <p>Version 1.0.0</p>
      </div>
    </footer>
  )
}
