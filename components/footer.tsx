"use client"

import Link from "next/link"
import { Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black/95 text-white border-t border-white/20">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between space-y-12 md:space-y-0">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link href="/" className="text-2xl font-heading font-bold hover:text-white/90 transition-all">
            Nemesis
          </Link>
          <p className="text-sm text-gray-400 text-center md:text-left">
            La plateforme communautaire esport française de référence.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <Discord className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white">Navigation</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="/explorer" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/equipes" className="hover:text-white transition-colors">Équipes</Link>
            <Link href="/joueurs" className="hover:text-white transition-colors">Joueurs</Link>
            <Link href="/recrutement" className="hover:text-white transition-colors">Recrutement</Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white">Support</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="/credits" className="hover:text-white transition-colors">Crédits</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="#" className="hover:text-white transition-colors">Règlement</Link>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="font-heading font-semibold text-white">Légal</h3>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-12 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 px-4 md:px-0">
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
