"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Trophy, Users, Target, Zap, ArrowRight, Play, Shield, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center animate-fade-in">
              {isAuthenticated && (
                <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-sm text-white">Bienvenue, {user?.username}</span>
                </div>
              )}

              <h1 className="text-6xl md:text-8xl font-heading font-bold mb-8 text-white">
                NEMESIS
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                La plateforme esport française qui connecte les joueurs, équipes et communautés.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-lg text-lg font-semibold hover-lift"
                  asChild
                >
                  <Link href={isAuthenticated ? "/community" : "/signup"}>
                    <Play className="mr-2 h-5 w-5" />
                    {isAuthenticated ? "Explorer" : "Commencer"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold hover-lift"
                >
                  <Link href="/updates">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Updates
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
                Une plateforme complète
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour votre parcours esport
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Trophy, 
                  title: "Équipes Pro", 
                  desc: "Rejoignez des équipes compétitives et participez aux tournois de haut niveau."
                },
                { 
                  icon: Users, 
                  title: "Communauté", 
                  desc: "Connectez-vous avec des joueurs passionnés d'esport français."
                },
                { 
                  icon: Target, 
                  title: "Recrutement", 
                  desc: "Trouvez votre équipe idéale grâce à notre système avancé."
                },
                { 
                  icon: Zap, 
                  title: "Performance", 
                  desc: "Suivez vos statistiques et améliorez vos performances."
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="glass-effect border-white/10 hover-lift transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-white/10 rounded-lg w-fit">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/70 text-center">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-white/5">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "3+", label: "Équipes actives" },
                { value: "15+", label: "Joueurs inscrits" },
                { value: "6", label: "Jeux supportés" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-2xl text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white">
                Prêt à rejoindre Nemesis ?
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Inscrivez-vous maintenant et commencez votre parcours esport.
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-lg text-lg font-semibold hover-lift"
                asChild
              >
                <Link href="/signup">
                  Créer mon compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}