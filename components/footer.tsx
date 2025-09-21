"use client"

import Link from "next/link"
import { Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-black/90 text-white">
      <div className="container py-12 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-heading font-bold text-white">
              Nemesis
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La plateforme communautaire esport française de référence.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white">Navigation</h3>
            <div className="space-y-2 text-sm">
              <Link href="/explorer" className="block text-gray-400 hover:text-white transition-colors">
                Explorer
              </Link>
              <Link href="/equipes" className="block text-gray-400 hover:text-white transition-colors">
                Équipes
              </Link>
              <Link href="/joueurs" className="block text-gray-400 hover:text-white transition-colors">
                Joueurs
              </Link>
              <Link href="/recrutement" className="block text-gray-400 hover:text-white transition-colors">
                Recrutement
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/credits" className="block text-gray-400 hover:text-white transition-colors">
                Crédits
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Règlement
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-white">Légal</h3>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="text-center md:text-left">
            <p>
              Chef de projet : <span className="text-white font-medium">Wayzze</span> | Développeur :{" "}
              <span className="text-white font-medium">16k</span>
            </p>
            <p className="mt-1">© 2024 Nemesis Esports. Tous droits réservés.</p>
          </div>
          <div className="mt-2 md:mt-0">Version 1.0.0</div>
        </div>
      </div>
    </footer>
  )
}
