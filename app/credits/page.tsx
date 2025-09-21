"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Code, Heart } from "lucide-react"

const teamMembers = [
  {
    name: "Wayzze",
    role: "Fondateur",
    title: "Chef de projet",
    badge: "Project Manager",
    icon: Crown,
    discord: "Wayzze#0001",
    email: "wayzze@quantum.gg",
    description:
      "Visionnaire et leader du projet Quantum. Responsable de la conception, de la stratégie et de la coordination de toutes les équipes.",
  },
  {
    name: "16k",
    role: "Développeur",
    title: "Développeur",
    badge: "Full-Stack Developer",
    icon: Code,
    discord: "16k#0002",
    email: "16k@quantum.gg",
    description:
      "Architecte technique et développeur principal de la plateforme Quantum. Responsable du développement et de la maintenance de l'infrastructure.",
  },
]

export default function CreditsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Titre */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">Crédits</h1>
            <p className="text-lg text-white/60">Les personnes qui ont rendu Quantum possible</p>
          </div>

          {/* Membres de l'équipe */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {teamMembers.map((member) => {
              const Icon = member.icon
              return (
                <Card key={member.name} className="text-center bg-black/50 border-white/20">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{member.name}</CardTitle>
                    <CardDescription className="text-lg">{member.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {member.badge}
                      </Badge>
                    </div>
                    <p className="text-white/80">{member.description}</p>
                    <div className="text-sm text-white/60">
                      <p>Discord: {member.discord}</p>
                      <p>Email: {member.email}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Communauté */}
          <Card className="bg-card/50">
            <CardContent className="py-8 text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Merci à notre communauté</h3>
              <p className="text-white/60 max-w-2xl mx-auto mb-6">
                Quantum n'existerait pas sans le soutien et la passion de notre communauté esport. Merci à tous les
                joueurs, équipes et supporters qui font vivre cette plateforme.
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

          {/* Footer texte */}
          <div className="mt-12 text-center text-sm text-white/60">
            <p>© 2024 Quantum Esports. Développé avec passion pour la communauté esport française.</p>
            <p className="mt-2">Version 1.0.0 - Janvier 2024</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
