"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Trophy, Users, Megaphone, Search, TrendingUp, Zap, Star, ArrowRight } from "lucide-react"

interface Update {
  id: number
  title: string
  description: string
  date: string
  type: "feature" | "tournament" | "community" | "maintenance"
  version?: string
  important?: boolean
}

const mockUpdates: Update[] = [
  {
    id: 1,
    title: "Nouvelle interface communauté",
    description: "Refonte complète de la section communauté avec un design moderne et une meilleure navigation entre équipes et joueurs.",
    date: "2024-01-20",
    type: "feature",
    version: "2.1.0",
    important: true
  },
  {
    id: 2,
    title: "Tournoi Rocket League - Inscriptions ouvertes",
    description: "Le tournoi mensuel Rocket League est maintenant ouvert aux inscriptions. Récompenses exclusives pour les 3 premières places.",
    date: "2024-01-18",
    type: "tournament",
    important: true
  },
  {
    id: 3,
    title: "Amélioration du système de recrutement",
    description: "Nouveau système de matching automatique entre joueurs et équipes basé sur les préférences et le niveau de jeu.",
    date: "2024-01-15",
    type: "feature",
    version: "2.0.5"
  },
  {
    id: 4,
    title: "Maintenance programmée",
    description: "Maintenance de routine prévue ce weekend pour améliorer les performances de la plateforme.",
    date: "2024-01-12",
    type: "maintenance"
  },
  {
    id: 5,
    title: "Nouveaux membres dans la communauté",
    description: "Plus de 50 nouveaux joueurs ont rejoint Nemesis cette semaine ! Bienvenue à tous.",
    date: "2024-01-10",
    type: "community"
  },
  {
    id: 6,
    title: "Support Valorant étendu",
    description: "Ajout de nouveaux rôles spécifiques à Valorant et amélioration du système de formation d'équipes.",
    date: "2024-01-08",
    type: "feature",
    version: "2.0.3"
  }
]

export default function UpdatesPage() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUpdates = mockUpdates.filter((update) => {
    const matchesType = selectedType === "all" || update.type === selectedType
    const matchesSearch =
      !searchTerm ||
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Zap className="h-4 w-4" />
      case "tournament":
        return <Trophy className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      case "maintenance":
        return <Megaphone className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "tournament":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "community":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "maintenance":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "feature":
        return "Nouveauté"
      case "tournament":
        return "Tournoi"
      case "community":
        return "Communauté"
      case "maintenance":
        return "Maintenance"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Dernières mises à jour</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
              Updates Nemesis
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Restez informé des dernières nouveautés, tournois et événements de la communauté.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">
                  {mockUpdates.filter(u => u.type === "feature").length}
                </div>
                <div className="text-sm text-white/70">Nouveautés</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">
                  {mockUpdates.filter(u => u.type === "tournament").length}
                </div>
                <div className="text-sm text-white/70">Tournois</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">
                  {mockUpdates.filter(u => u.important).length}
                </div>
                <div className="text-sm text-white/70">Importantes</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">7</div>
                <div className="text-sm text-white/70">Cette semaine</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher une mise à jour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="feature">Nouveautés</SelectItem>
                <SelectItem value="tournament">Tournois</SelectItem>
                <SelectItem value="community">Communauté</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Updates List */}
          <div className="space-y-6">
            {filteredUpdates.length === 0 ? (
              <Card className="glass-effect border-white/10">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Aucune mise à jour trouvée avec ces filtres.</p>
                </CardContent>
              </Card>
            ) : (
              filteredUpdates.map((update) => (
                <Card 
                  key={update.id} 
                  className={`glass-effect border-white/10 hover-lift transition-all duration-300 ${
                    update.important ? 'ring-1 ring-white/20' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-3 flex-wrap">
                          {update.important && (
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          )}
                          <Badge variant="outline" className={getTypeColor(update.type)}>
                            {getTypeIcon(update.type)}
                            <span className="ml-1">{getTypeLabel(update.type)}</span>
                          </Badge>
                          {update.version && (
                            <Badge variant="secondary" className="bg-white/10 text-white">
                              v{update.version}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl text-white">
                          {update.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center text-sm text-white/60 ml-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(update.date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/70 text-base leading-relaxed mb-4">
                      {update.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        alert(`${update.title}\n\nType: ${getTypeLabel(update.type)}\nDate: ${new Date(update.date).toLocaleDateString('fr-FR')}\n${update.version ? `Version: ${update.version}\n` : ''}\n${update.description}`)
                      }}
                    >
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Newsletter CTA */}
          <Card className="glass-effect border-white/10 mt-12">
            <CardContent className="py-8 text-center">
              <Megaphone className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Restez informé
              </h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Ne manquez aucune mise à jour importante de Nemesis. Suivez-nous sur nos réseaux sociaux.
              </p>
              <Button 
                className="bg-white text-black hover:bg-white/90"
                onClick={() => alert("Fonctionnalité à venir !")}
              >
                S'abonner aux notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}