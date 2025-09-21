"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Shield, Edit, Trash2, UserPlus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: number
  username: string
  email: string
  role: string
  discord_id: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = async (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      })

      if (response.ok) {
        await fetchUsers()
        setIsEditDialogOpen(false)
        setEditingUser(null)
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
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

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchUsers()
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
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
    return <div className="text-center py-8 text-white">Chargement des utilisateurs...</div>
  }

  return (
    <Card className="bg-black/50 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gestion des utilisateurs</CardTitle>
            <CardDescription className="text-white/60">
              Administrez les comptes utilisateurs et leurs rôles
            </CardDescription>
          </div>
          <Button className="bg-white text-black hover:bg-white/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-white">{user.username}</h4>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : user.role === "developer"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                        }
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Email:</span>
                        <span className="ml-2 text-white">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Discord:</span>
                        <span className="ml-2 font-mono text-xs text-white">{user.discord_id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog open={isEditDialogOpen && editingUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Modifier l'utilisateur</DialogTitle>
                          <DialogDescription className="text-white/60">
                            Modifiez les informations de l'utilisateur
                          </DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username" className="text-white">
                                Nom d'utilisateur
                              </Label>
                              <Input
                                id="username"
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-white">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="discord" className="text-white">
                                Discord ID
                              </Label>
                              <Input
                                id="discord"
                                value={editingUser.discord_id}
                                onChange={(e) => setEditingUser({ ...editingUser, discord_id: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="role" className="text-white">
                                Rôle
                              </Label>
                              <Select
                                value={editingUser.role}
                                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/20">
                                  <SelectItem value="player" className="text-white">
                                    Player
                                  </SelectItem>
                                  <SelectItem value="staff" className="text-white">
                                    Staff
                                  </SelectItem>
                                  <SelectItem value="admin" className="text-white">
                                    Admin
                                  </SelectItem>
                                  <SelectItem value="developer" className="text-white">
                                    Developer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateUser} className="bg-white text-black hover:bg-white/90">
                            Sauvegarder
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {user.role !== "admin" && user.role !== "developer" && (
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
                              Êtes-vous sûr de vouloir supprimer l'utilisateur {user.username} ? Cette action est
                              irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
