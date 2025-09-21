"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Code, Heart } from "lucide-react"

export default function CreditsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* Titre */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">Crédits</h1>
            <p className="text-lg md:text-xl text-gray-400">Les personnes qui ont rendu Nemesis possible</p>
          </div>

          {/* Equipe */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12">
            {/* Wayzze */}
            <Card className="text-center bg-gray-900/50 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto mb-3 p-3 bg-primary/20 rounded-full w-fit">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Wayzze</CardTitle>
                <CardDescription className="text-sm text-gray-400">Chef de projet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Project Manager</Badge>
                </div>
                <p className="text-gray-300 text-sm">
                  Visionnaire et leader du projet Nemesis. Responsable de la conception, de la stratégie et de la coordination des équipes.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Discord: Wayzze#0001</p>
                  <p>Email: wayzze@Nemesis.gg</p>
                </div>
              </CardContent>
            </Card>

            {/* 16k */}
            <Card className="text-center bg-gray-900/50 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto mb-3 p-3 bg-primary/20 rounded-full w-fit">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">16k</CardTitle>
                <CardDescription className="text-sm text-gray-400">Développeur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Full-Stack Developer</Badge>
                </div>
                <p className="text-gray-300 text-sm">
                  Architecte technique et développeur principal de la plateforme Nemesis. Responsable du développement et de la maintenance de l'infrastructure.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Discord: 16k#0002</p>
                  <p>Email: 16k@Nemesis.gg</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communauté */}
          <Card className="bg-gray-900/40 hover:bg-gray-900/60 transition-colors duration-300">
            <CardContent className="py-8 text-center">
              <div className="mx-auto mb-3 p-3 bg-primary/20 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">Merci à notre communauté</h3>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
                Nemesis n'existerait pas sans le soutien et la passion de notre communauté esport. Merci à tous les joueurs, équipes et supporters.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Joueurs</Badge>
                <Badge variant="secondary">Équipes</Badge>
                <Badge variant="secondary">Supporters</Badge>
                <Badge variant="secondary">Partenaires</Badge>
                <Badge variant="secondary">Communauté Discord</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Footer bas de page centré */}
          <div className="mt-12 py-6 w-full flex flex-col items-center text-center text-sm text-gray-400 space-y-1">
            <p>
              Chef de projet : <span className="text-white font-medium">Wayzze</span> | Développeur : <span className="text-white font-medium">16k</span>
            </p>
            <p>© 2025 Nemesis Esports. Tous droits réservés.</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
