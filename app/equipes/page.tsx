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
import { Trophy, Edit, Trash2, Plus, Users, Crown, Search } from "lucide-react"

interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status: string
  created_at: string
}

const availableGames = [
  "Rocket League",
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Overwatch 2",
  "Apex Legends",
]

const teamStatuses = [
  { value: "active", label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { value: "inactive", label: "Inactive", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  { value: "recruiting", label: "Recrutement", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
]

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    captain: "",
    members: [],
    game: "",
    description: "",
    status: "active",
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    filterTeams()
  }, [teams, searchTerm, gameFilter, statusFilter])

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/teams")
      const data = await res.json()
      if (data.success) {
        setTeams(data.data)
      } else {
        setTeams([])
      }
    } catch (err) {
      console.error("Erreur fetchTeams:", err)
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  const filterTeams = () => {
    let filtered = [...teams]
    if (searchTerm) {
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.game.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (gameFilter !== "all") filtered = filtered.filter(t => t.game === gameFilter)
    if (statusFilter !== "all") filtered = filtered.filter(t => t.status === statusFilter)
    setFilteredTeams(filtered)
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.captain || !newTeam.game) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      })
      const result = await res.json()
      if (result.success) {
        await fetchTeams()
        setIsCreateDialogOpen(false)
        setNewTeam({ name: "", captain: "", members: [], game: "", description: "", status: "active" })
      } else {
        alert(result.error || "Erreur lors de la création")
      }
    } catch (err) {
      console.error("Erreur handleCreateTeam:", err)
    }
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setIsEditDialogOpen(true)
  }

  const handleUpdateTeam = async () => {
    if (!editingTeam) return
    try {
      const res = await fetch(`/api/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTeam),
      })
      const result = await res.json()
      if (result.success) {
        await fetchTeams()
        setIsEditDialogOpen(false)
        setEditingTeam(null)
      } else {
        alert(result.error || "Erreur lors de la mise à jour")
      }
    } catch (err) {
      console.error("Erreur handleUpdateTeam:", err)
    }
  }

  const handleDeleteTeam = async (id: number) => {
    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        await fetchTeams()
      } else {
        alert(result.error || "Erreur lors de la suppression")
      }
    } catch (err) {
      console.error("Erreur handleDeleteTeam:", err)
    }
  }

  const getStatusColor = (status: string) => {
    const s = teamStatuses.find(s => s.value === status)
    return s?.color || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  if (loading) return <div className="text-white text-center py-8">Chargement des équipes...</div>

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Gestion des équipes
            </CardTitle>
            <CardDescription className="text-white/60">{teams.length} équipes</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une équipe</DialogTitle>
                <DialogDescription className="text-white/60">Ajoutez une équipe</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Nom *</Label>
                    <Input
                      className="bg-white/10 border-white/20 text-white"
                      value={newTeam.name}
                      onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Capitaine *</Label>
                    <Input
                      className="bg-white/10 border-white/20 text-white"
                      value={newTeam.captain}
                      onChange={e => setNewTeam({ ...newTeam, captain: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Jeu *</Label>
                    <Select
                      value={newTeam.game}
                      onValueChange={v => setNewTeam({ ...newTeam, game: v })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Sélectionnez un jeu" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {availableGames.map(game => (
                          <SelectItem key={game} value={game} className="text-white">{game}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Statut</Label>
                    <Select
                      value={newTeam.status}
                      onValueChange={v => setNewTeam({ ...newTeam, status: v })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {teamStatuses.map(s => (
                          <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    className="bg-white/10 border-white/20 text-white"
                    value={newTeam.description}
                    onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-white/20 text-white">Annuler</Button>
                <Button onClick={handleCreateTeam} className="bg-white text-black hover:bg-white/90">Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {/* Filtres */}
      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Filtrer par jeu" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="all">Tous les jeux</SelectItem>
              {availableGames.map(game => <SelectItem key={game} value={game}>{game}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="all">Tous les statuts</SelectItem>
              {teamStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Liste des équipes */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="text-center text-white/60 py-8">Aucune équipe trouvée</div>
          ) : (
            filteredTeams.map(team => (
              <Card key={team.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
                <CardContent className="py-4 flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-medium">{team.name}</h4>
                      <Badge variant="outline" className={getStatusColor(team.status)}>{team.status}</Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {team.members.length} membres
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm">Capitaine : {team.captain}</p>
                    {team.description && <p className="text-white/50 text-sm">{team.description}</p>}
                    <p className="text-white/40 text-xs">Jeu : {team.game}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditTeam(team)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Supprimer {team.name} ?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDeleteTeam(team.id)}>Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Dialog Edition */}
      {editingTeam && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Modifier {editingTeam.name}</DialogTitle>
              <DialogDescription className="text-white/60">Mettez à jour l'équipe</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nom *</Label>
                  <Input
                    className="bg-white/10 border-white/20 text-white"
                    value={editingTeam.name}
                    onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-white">Capitaine *</Label>
                  <Input
                    className="bg-white/10 border-white/20 text-white"
                    value={editingTeam.captain}
                    onChange={e => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Jeu *</Label>
                  <Select
                    value={editingTeam.game}
                    onValueChange={v => setEditingTeam({ ...editingTeam, game: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionnez un jeu" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {availableGames.map(game => (
                        <SelectItem key={game} value={game} className="text-white">{game}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Statut</Label>
                  <Select
                    value={editingTeam.status}
                    onValueChange={v => setEditingTeam({ ...editingTeam, status: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {teamStatuses.map(s => (
                        <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  className="bg-white/10 border-white/20 text-white"
                  value={editingTeam.description}
                  onChange={e => setEditingTeam({ ...editingTeam, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/20 text-white">Annuler</Button>
              <Button onClick={handleUpdateTeam} className="bg-white text-black hover:bg-white/90">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
