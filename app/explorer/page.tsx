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
import { Calendar, Trophy, Users, Megaphone, Search } from "lucide-react"

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
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "recruitment":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "news":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">Explorer Nemesis</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les dernières actualités, tournois et opportunités de recrutement.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les jeux</SelectItem>
                {availableGames.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="tournament">Tournois</SelectItem>
                <SelectItem value="recruitment">Recrutement</SelectItem>
                <SelectItem value="news">Actualités</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Équipes actives</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockTeams.length}</div>
                <p className="text-xs text-muted-foreground">Across {availableGames.length} games</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annonces actives</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockAnnouncements.length}</div>
                <p className="text-xs text-muted-foreground">Dernière mise à jour aujourd'hui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tournois à venir</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {mockAnnouncements.filter((a) => a.type === "tournament").length}
                </div>
                <p className="text-xs text-muted-foreground">Ce mois-ci</p>
              </CardContent>
            </Card>
          </div>

          {/* Announcements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">Dernières annonces</h2>

            {filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune annonce trouvée avec ces filtres.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getTypeColor(announcement.type)}>
                              {getTypeIcon(announcement.type)}
                              <span className="ml-1 capitalize">{announcement.type}</span>
                            </Badge>
                            {announcement.game && <Badge variant="secondary">{announcement.game}</Badge>}
                          </div>
                          <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{announcement.description}</CardDescription>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          En savoir plus
                        </Button>
                      </div>
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
