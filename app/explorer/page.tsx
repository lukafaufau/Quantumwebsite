"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { mockAnnouncements, mockTeams, availableGames } from "@/lib/data"
import { Calendar, Trophy, Users, Megaphone, Search, ArrowRight, TrendingUp } from "lucide-react"

export default function ExplorerPage() {
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesGame = selectedGame === "all" || announcement.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || announcement.type === selectedType

    return matchesGame && matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tournament":
        return <Trophy className="h-4 w-4" />
      case "recruitment":
        return <Users className="h-4 w-4" />
      case "news":
        return <Megaphone className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tournament":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "recruitment":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "news":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tournament":
        return "Tournoi"
      case "recruitment":
        return "Recrutement"
      case "news":
        return "Actualité"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Megaphone className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Actualités Esport</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
              Explorer Nemesis
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Découvrez les dernières actualités, tournois et opportunités de recrutement.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-effect border-white/10 text-center">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Équipes actives</CardTitle>
                <Users className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockTeams.length}</div>
                <p className="text-xs text-white/60">Sur {availableGames.length} jeux</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 text-center">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Annonces actives</CardTitle>
                <Megaphone className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAnnouncements.length}</div>
                <p className="text-xs text-white/60">Mises à jour récentes</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 text-center">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Tournois à venir</CardTitle>
                <Trophy className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {mockAnnouncements.filter((a) => a.type === "tournament").length}
                </div>
                <p className="text-xs text-white/60">Ce mois-ci</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les jeux</SelectItem>
                {availableGames.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="tournament">Tournois</SelectItem>
                <SelectItem value="recruitment">Recrutement</SelectItem>
                <SelectItem value="news">Actualités</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Announcements */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-white">Dernières annonces</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href="/updates">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir toutes les updates
                </a>
              </Button>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <Card className="glass-effect border-white/10">
                <CardContent className="py-12 text-center">
                  <Megaphone className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Aucune annonce trouvée avec ces filtres.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="glass-effect border-white/10 hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <Badge variant="outline" className={getTypeColor(announcement.type)}>
                              {getTypeIcon(announcement.type)}
                              <span className="ml-1">{getTypeLabel(announcement.type)}</span>
                            </Badge>
                            {announcement.game && (
                              <Badge variant="secondary" className="bg-white/10 text-white">
                                {announcement.game}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl text-white">{announcement.title}</CardTitle>
                        </div>
                        <div className="text-sm text-white/60 ml-4">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(announcement.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/70 text-base mb-4">
                        {announcement.description}
                      </CardDescription>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          alert(`${announcement.title}\n\nType: ${getTypeLabel(announcement.type)}\nJeu: ${announcement.game || 'Général'}\nDate: ${new Date(announcement.date).toLocaleDateString('fr-FR')}\n\n${announcement.description}`)
                        }}
                      >
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}