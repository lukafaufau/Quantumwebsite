import Link from "next/link"
import { Github, Twitter, Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-heading font-bold text-primary">
              Nemesis
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme communautaire esport française de référence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Navigation</h3>
            <div className="space-y-2 text-sm">
              <Link href="/explorer" className="block text-muted-foreground hover:text-primary transition-colors">
                Explorer
              </Link>
              <Link href="/equipes" className="block text-muted-foreground hover:text-primary transition-colors">
                Équipes
              </Link>
              <Link href="/joueurs" className="block text-muted-foreground hover:text-primary transition-colors">
                Joueurs
              </Link>
              <Link href="/recrutement" className="block text-muted-foreground hover:text-primary transition-colors">
                Recrutement
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/credits" className="block text-muted-foreground hover:text-primary transition-colors">
                Crédits
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Règlement
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Légal</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                CGU
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left text-sm text-muted-foreground">
              <p>
                Chef de projet : <span className="text-primary font-medium">Wayzze</span> | Développeur :{" "}
                <span className="text-primary font-medium">16k</span>
              </p>
              <p className="mt-1">© 2024 Nemesis Esports. Tous droits réservés.</p>
            </div>
            <div className="text-sm text-muted-foreground">Version 1.0.0</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
