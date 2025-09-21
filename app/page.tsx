"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Trophy, Users, Target, Zap, ArrowRight, Star } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState<any>(null)

  // Fetch content
  useEffect(() => {
    fetch("/api/content?page=home")
      .then(res => res.json())
      .then(data => {
        setContent(data)
        setEditableContent(data)
      })
      .catch(() => {
        const defaultContent = {
          hero: {
            title: "NEMESIS",
            subtitle:
              "La plateforme communautaire esport française qui centralise la gestion des équipes, le recrutement et les annonces esport.",
            cta_primary: "Rejoindre Nemesis",
            cta_secondary: "Voir les équipes",
          },
          features: {
            title: "Pourquoi choisir NEMESIS ?",
            subtitle: "Découvrez tous les avantages de notre plateforme esport",
          },
        }
        setContent(defaultContent)
        setEditableContent(defaultContent)
      })
  }, [])

  const saveContent = async () => {
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "home", content: editableContent }),
      })
      setContent(editableContent)
      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  if (!content)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white animate-pulse-slow">Chargement...</div>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          {(user?.role === "admin" || user?.role === "developer") && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="fixed top-20 right-4 z-40 bg-white/10 hover:bg-white/20 border-white/20"
              size="sm"
            >
              {isEditing ? "Annuler" : "Modifier"}
            </Button>
          )}

          <div className="container mx-auto max-w-4xl">
            {isEditing ? (
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  value={editableContent.hero?.title || ""}
                  onChange={(e) =>
                    setEditableContent({
                      ...editableContent,
                      hero: { ...editableContent.hero, title: e.target.value },
                    })
                  }
                  className="w-full text-4xl md:text-6xl lg:text-7xl font-heading font-akira font-bold bg-transparent border-b border-white/20 text-center text-white placeholder-white/50"
                  placeholder="Titre principal"
                />
                <textarea
                  value={editableContent.hero?.subtitle || ""}
                  onChange={(e) =>
                    setEditableContent({
                      ...editableContent,
                      hero: { ...editableContent.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full text-lg md:text-xl bg-transparent border border-white/20 rounded p-4 text-center text-white placeholder-white/50 resize-none"
                  rows={3}
                  placeholder="Sous-titre"
                />
                <div className="flex justify-center space-x-4">
                  <Button onClick={saveContent} className="bg-white text-black hover:bg-white/90">
                    Sauvegarder
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-akira font-bold mb-6 leading-tight">
                  {isAuthenticated ? `Bienvenue, ${user?.username}` : ""}
                  <span className="ml-2">{content.hero?.title}</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {content.hero?.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="group bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 border-glow"
                    asChild
                  >
                    <Link href={isAuthenticated ? "/explorer" : "/signup"}>
                      {isAuthenticated
                        ? "Explorer Nemesis"
                        : content.hero?.cta_primary || "Rejoindre Nemesis"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Link href="/equipes">{content.hero?.cta_secondary || "Voir les équipes"}</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/5 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-glow">
              {content.features?.title}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
              {content.features?.subtitle}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Trophy, title: "Équipes Pro", desc: "Rejoignez des équipes compétitives et participez aux tournois esport de haut niveau." },
                { icon: Users, title: "Communauté", desc: "Connectez-vous avec d'autres joueurs passionnés d'esport français." },
                { icon: Target, title: "Recrutement", desc: "Trouvez votre équipe idéale grâce à notre système de recrutement avancé." },
                { icon: Zap, title: "Performance", desc: "Suivez vos statistiques et améliorez vos performances en continu." },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="text-center bg-black/50 border-white/20 hover-lift transition-all duration-500"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-fit">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-white/80">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "3+", label: "Équipes actives" },
              { value: "15+", label: "Joueurs inscrits" },
              { value: "6", label: "Jeux supportés" },
              { value: "24/7", label: "Support communauté" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-heading font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-16 px-4 bg-white/5 text-center">
            <div className="container mx-auto max-w-3xl">
              <div className="flex justify-center mb-6 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-white text-white animate-glow" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Prêt à rejoindre l'élite esport ?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
                Inscrivez-vous dès maintenant et commencez votre parcours dans l'esport compétitif français.
              </p>
              <Button
                size="lg"
                className="group bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 border-glow"
                asChild
              >
                <Link href="/signup">
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
