"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Megaphone, Calendar, Trophy, Users, AlertCircle } from "lucide-react"

interface Announcement {
  id: number
  title: string
  description: string
  type: string
  game?: string
  date: string
  author: string
  visible?: boolean
  priority?: string
}

const availableGames = [
  "Rocket League",
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Overwatch 2",
  "Apex Legends"
]

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    description: "",
    type: "general",
    game: "",
    priority: "medium"
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/announcements")
      const data = await response.json()
      if (data.success) {
        setAnnouncements(data.data || [])
      } else {
        console.error("Erreur API:", data.error)
        setAnnouncements([])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error)
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAnnouncement,
          date: new Date().toISOString(),
          author: "Admin",
          visible: true,
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchAnnouncements()
        setIsCreateDialogOpen(false)
        setNewAnnouncement({ title: "", description: "", type: "general", game: "", priority: "medium" })
        alert("Annonce créée avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la création de l'annonce: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Erreur de connexion lors de la création")
    }
  }

  const handleEditAnnouncement = async (announcement: Announcement) => {
    setEditingAnnouncement({ ...announcement })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return

    try {
      const response = await fetch(`/api/announcements/${editingAnnouncement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAnnouncement),
      })

      const result = await response.json()
      if (result.success) {
        await fetchAnnouncements()
        setIsEditDialogOpen(false)
        setEditingAnnouncement(null)
        alert("Annonce mise à jour avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la mise à jour de l'annonce: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      alert("Erreur de connexion lors de la mise à jour")
    }
  }

  const handleDeleteAnnouncement = async (announcementId: number) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, { method: "DELETE" })
      const result = await response.json()
      if (result.success) {
        await fetchAnnouncements()
        alert("Annonce supprimée avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la suppression de l'annonce: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur de connexion lors de la suppression")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tournament":
        return <Trophy className="h-4 w-4" />
      case "recruitment":
        return <Users className="h-4 w-4" />
      case "news":
        return <Megaphone className="h-4 w-4" />
      case "update":
        return <AlertCircle className="h-4 w-4" />
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
      case "update":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des annonces...
      </div>
    )
  }

  return (
    <Card className="bg-black border-white/20">
      {/* Header et création */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <Megaphone className="h-5 w-5" />
              <span>Gestion des annonces</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Créez et modifiez les annonces de la plateforme ({announcements.length} annonces)
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 max-w-2xl">
              {/* Formulaire création */}
              <DialogHeader>
                <DialogTitle className="text-white">Créer une nouvelle annonce</DialogTitle>
                <DialogDescription className="text-white/60">
                  Ajoutez une nouvelle annonce à la plateforme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="title" className="text-white">Titre *</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Titre de l'annonce"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    rows={4}
                    placeholder="Description de l'annonce"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-white">Type</Label>
                    <Select
                      value={newAnnouncement.type || "general"}
                      onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="general" className="text-white">Général</SelectItem>
                        <SelectItem value="tournament" className="text-white">Tournoi</SelectItem>
                        <SelectItem value="recruitment" className="text-white">Recrutement</SelectItem>
                        <SelectItem value="news" className="text-white">Actualité</SelectItem>
                        <SelectItem value="update" className="text-white">Mise à jour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-white">Priorité</Label>
                    <Select
                      value={newAnnouncement.priority || "medium"}
                      onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="low" className="text-white">Faible</SelectItem>
                        <SelectItem value="medium" className="text-white">Moyenne</SelectItem>
                        <SelectItem value="high" className="text-white">Élevée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="game" className="text-white">Jeu (optionnel)</Label>
                  <Select
                    value={newAnnouncement.game || ""}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, game: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionner un jeu" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="" className="text-white">Aucun jeu spécifique</SelectItem>
                      {availableGames.map((game) => (
                        <SelectItem key={game} value={game} className="text-white">{game}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                  Annuler
                </Button>
                <Button onClick={handleCreateAnnouncement} className="bg-white text-black hover:bg-white/90">Créer l'annonce</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {/* Liste des annonces */}
      <CardContent>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune annonce trouvée</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="font-medium text-white">{announcement.title}</h4>
                        <Badge variant="outline" className={getTypeColor(announcement.type)}>
                          {getTypeIcon(announcement.type)}
                          <span className="ml-1 capitalize">{announcement.type}</span>
                        </Badge>
                        {announcement.priority && (
                          <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                            {announcement.priority === 'high' ? 'Élevée' : 
                             announcement.priority === 'medium' ? 'Moyenne' : 'Faible'}
                          </Badge>
                        )}
                        {announcement.game && <Badge variant="secondary">{announcement.game}</Badge>}
                      </div>
                      <p className="text-sm text-white/60">{announcement.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-white/40">
                        <span>Publié le {new Date(announcement.date).toLocaleDateString("fr-FR")}</span>
                        <span>par {announcement.author}</span>
                        <span>ID: #{announcement.id}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black border-white/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              Êtes-vous sûr de vouloir supprimer l'annonce "{announcement.title}" ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnnouncement(announcement.id)} className="bg-red-600 hover:bg-red-700">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'annonce</DialogTitle>
            <DialogDescription className="text-white/60">Modifiez les informations de l'annonce</DialogDescription>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="edit-title" className="text-white">Titre *</Label>
                <Input
                  id="edit-title"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-white">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editingAnnouncement.description}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type" className="text-white">Type</Label>
                  <Select
                    value={editingAnnouncement.type || "general"}
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, type: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="general" className="text-white">Général</SelectItem>
                      <SelectItem value="tournament" className="text-white">Tournoi</SelectItem>
                      <SelectItem value="recruitment" className="text-white">Recrutement</SelectItem>
                      <SelectItem value="news" className="text-white">Actualité</SelectItem>
                      <SelectItem value="update" className="text-white">Mise à jour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority" className="text-white">Priorité</Label>
                  <Select
                    value={editingAnnouncement.priority || "medium"}
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, priority: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="low" className="text-white">Faible</SelectItem>
                      <SelectItem value="medium" className="text-white">Moyenne</SelectItem>
                      <SelectItem value="high" className="text-white">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-game" className="text-white">Jeu</Label>
                <Select
                  value={editingAnnouncement.game || ""}
                  onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, game: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Sélectionner un jeu" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="" className="text-white">Aucun jeu spécifique</SelectItem>
                    {availableGames.map((game) => (
                      <SelectItem key={game} value={game} className="text-white">{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">Annuler</Button>
            <Button onClick={handleUpdateAnnouncement} className="bg-white text-black hover:bg-white/90">Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
