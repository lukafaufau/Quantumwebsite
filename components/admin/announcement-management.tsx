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
import { Edit, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Announcement {
  id: number
  title: string
  description: string
  type: string
  game?: string
  date: string
  author: string
}

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
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAnnouncement,
          date: new Date().toISOString(),
          author: "Admin",
        }),
      })

      if (response.ok) {
        await fetchAnnouncements()
        setIsCreateDialogOpen(false)
        setNewAnnouncement({ title: "", description: "", type: "general", game: "" })
        toast({
          title: "Succès",
          description: "Annonce créée avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création",
        variant: "destructive",
      })
    }
  }

  const handleEditAnnouncement = async (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
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

      if (response.ok) {
        await fetchAnnouncements()
        setIsEditDialogOpen(false)
        setEditingAnnouncement(null)
        toast({
          title: "Succès",
          description: "Annonce mise à jour avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAnnouncement = async (announcementId: number) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchAnnouncements()
        toast({
          title: "Succès",
          description: "Annonce supprimée avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-white">Chargement des annonces...</div>
  }

  return (
    <Card className="bg-black/50 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gestion des annonces</CardTitle>
            <CardDescription className="text-white/60">Créez et modifiez les annonces de la plateforme</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une nouvelle annonce</DialogTitle>
                <DialogDescription className="text-white/60">
                  Ajoutez une nouvelle annonce à la plateforme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Titre de l'annonce"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Description de l'annonce"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-white">
                    Type
                  </Label>
                  <Select
                    value={newAnnouncement.type}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="general" className="text-white">
                        Général
                      </SelectItem>
                      <SelectItem value="tournament" className="text-white">
                        Tournoi
                      </SelectItem>
                      <SelectItem value="recruitment" className="text-white">
                        Recrutement
                      </SelectItem>
                      <SelectItem value="update" className="text-white">
                        Mise à jour
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="game" className="text-white">
                    Jeu (optionnel)
                  </Label>
                  <Input
                    id="game"
                    value={newAnnouncement.game}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, game: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Nom du jeu"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateAnnouncement} className="bg-white text-black hover:bg-white/90">
                  Créer l'annonce
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-white">{announcement.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          announcement.type === "tournament"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : announcement.type === "recruitment"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                        }
                      >
                        {announcement.type}
                      </Badge>
                      {announcement.game && <Badge variant="secondary">{announcement.game}</Badge>}
                    </div>

                    <p className="text-sm text-white/60">{announcement.description}</p>

                    <p className="text-xs text-white/40">
                      Publié le {new Date(announcement.date).toLocaleDateString("fr-FR")} par {announcement.author}
                    </p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Dialog
                      open={isEditDialogOpen && editingAnnouncement?.id === announcement.id}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Modifier l'annonce</DialogTitle>
                          <DialogDescription className="text-white/60">
                            Modifiez les informations de l'annonce
                          </DialogDescription>
                        </DialogHeader>
                        {editingAnnouncement && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-title" className="text-white">
                                Titre
                              </Label>
                              <Input
                                id="edit-title"
                                value={editingAnnouncement.title}
                                onChange={(e) =>
                                  setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-description" className="text-white">
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={editingAnnouncement.description}
                                onChange={(e) =>
                                  setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-type" className="text-white">
                                Type
                              </Label>
                              <Select
                                value={editingAnnouncement.type}
                                onValueChange={(value) =>
                                  setEditingAnnouncement({ ...editingAnnouncement, type: value })
                                }
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/20">
                                  <SelectItem value="general" className="text-white">
                                    Général
                                  </SelectItem>
                                  <SelectItem value="tournament" className="text-white">
                                    Tournoi
                                  </SelectItem>
                                  <SelectItem value="recruitment" className="text-white">
                                    Recrutement
                                  </SelectItem>
                                  <SelectItem value="update" className="text-white">
                                    Mise à jour
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-game" className="text-white">
                                Jeu
                              </Label>
                              <Input
                                id="edit-game"
                                value={editingAnnouncement.game || ""}
                                onChange={(e) =>
                                  setEditingAnnouncement({ ...editingAnnouncement, game: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateAnnouncement} className="bg-white text-black hover:bg-white/90">
                            Sauvegarder
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            Êtes-vous sûr de vouloir supprimer l'annonce "{announcement.title}" ? Cette action est
                            irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
