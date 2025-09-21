"use client"

import Link from "next/link"
import { Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/20">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row justify-between gap-12 md:gap-0">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link href="/" className="text-3xl font-heading font-bold hover:text-white/80 transition-all">
            Nemesis
          </Link>
          <p className="text-sm text-gray-400 text-center md:text-left leading-relaxed max-w-xs">
            La plateforme communautaire esports française de référence.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Discord"
            >
              <Discord className="h-7 w-7 hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white hover:text-white/80 transition-all cursor-default">Navigation</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="/explorer" className="hover:text-white transition-all duration-200">Explorer</Link>
            <Link href="/equipes" className="hover:text-white transition-all duration-200">Équipes</Link>
            <Link href="/joueurs" className="hover:text-white transition-all duration-200">Joueurs</Link>
            <Link href="/recrutement" className="hover:text-white transition-all duration-200">Recrutement</Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white hover:text-white/80 transition-all cursor-default">Support</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="/credits" className="hover:text-white transition-all duration-200">Crédits</Link>
            <Link href="#" className="hover:text-white transition-all duration-200">Contact</Link>
            <Link href="#" className="hover:text-white transition-all duration-200">FAQ</Link>
            <Link href="#" className="hover:text-white transition-all duration-200">Règlement</Link>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white hover:text-white/80 transition-all cursor-default">Légal</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="#" className="hover:text-white transition-all duration-200">Mentions légales</Link>
            <Link href="#" className="hover:text-white transition-all duration-200">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-all duration-200">CGU</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 px-4 md:px-0">
        <div className="text-center md:text-left space-y-1">
          <p>
            Chef de projet : <span className="text-white font-medium">Wayzze</span> | Développeur :{" "}
            <span className="text-white font-medium">16k</span>
          </p>
          <p>© 2024 Nemesis Esports. Tous droits réservés.</p>
        </div>
        <div className="mt-2 md:mt-0 text-center md:text-right">Version 1.0.0</div>
      </div>
    </footer>
  )
}
