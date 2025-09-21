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
import { Ticket, Plus, Trash2, Copy, Users } from "lucide-react"

interface InviteCode {
  id: number
  code: string
  role: 'player' | 'staff'
  uses_left: number
  max_uses: number
  expires_at?: string
  created_by: string
  created_at: string
  used_by: string[]
}

export function InviteCodeManagement() {
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCode, setNewCode] = useState({
    code: "",
    role: "player" as "player" | "staff",
    max_uses: 1,
    expires_at: "",
  })

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    try {
      const response = await fetch("/api/invite-codes")
      const data = await response.json()
      if (data.success) {
        setCodes(data.data || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCode = async () => {
    if (!newCode.role || newCode.max_uses < 1) {
      alert("Veuillez remplir tous les champs correctement")
      return
    }

    try {
      const response = await fetch("/api/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCode,
          created_by: "Admin", // In real app, get from auth context
          expires_at: newCode.expires_at || undefined,
          used_by: [],
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchCodes()
        setIsCreateDialogOpen(false)
        setNewCode({ code: "", role: "player", max_uses: 1, expires_at: "" })
        alert("Code d'invitation créé avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la création du code")
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const handleDeleteCode = async (codeId: number) => {
    try {
      const response = await fetch(`/api/invite-codes/${codeId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await fetchCodes()
        alert("Code d'invitation supprimé avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la suppression du code")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Code "${code}" copié dans le presse-papiers!`)
  }

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 15).toUpperCase()
    setNewCode({ ...newCode, code })
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des codes d'invitation...
      </div>
    )
  }

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <Ticket className="h-5 w-5" />
              <span>Codes d'invitation</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Créez et gérez les codes d'invitation pour nouveaux utilisateurs
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Créer un code d'invitation</DialogTitle>
                <DialogDescription className="text-white/60">
                  Générez un nouveau code d'invitation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-white">
                    Code (laissez vide pour générer automatiquement)
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      value={newCode.code}
                      onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Code personnalisé"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomCode}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Générer
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="role" className="text-white">
                    Rôle attribué
                  </Label>
                  <Select
                    value={newCode.role}
                    onValueChange={(value: "player" | "staff") => setNewCode({ ...newCode, role: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="player" className="text-white">
                        Joueur
                      </SelectItem>
                      <SelectItem value="staff" className="text-white">
                        Staff
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max_uses" className="text-white">
                    Nombre d'utilisations maximum
                  </Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={newCode.max_uses}
                    onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) || 1 })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at" className="text-white">
                    Date d'expiration (optionnel)
                  </Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={newCode.expires_at}
                    onChange={(e) => setNewCode({ ...newCode, expires_at: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCode} className="bg-white text-black hover:bg-white/90">
                  Créer le code
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {codes.map((code) => (
            <Card key={code.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <code className="font-mono text-lg text-white bg-white/10 px-2 py-1 rounded">
                        {code.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(code.code)}
                        className="text-white hover:bg-white/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Badge
                        variant="outline"
                        className={
                          code.role === "staff"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-green-500/10 text-green-500 border-green-500/20"
                        }
                      >
                        {code.role}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Utilisations:</span>
                        <span className="ml-2 text-white">
                          {code.max_uses - code.uses_left} / {code.max_uses}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Créé par:</span>
                        <span className="ml-2 text-white">{code.created_by}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Créé le:</span>
                        <span className="ml-2 text-white">
                          {new Date(code.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      {code.expires_at && (
                        <div>
                          <span className="text-white/60">Expire le:</span>
                          <span className="ml-2 text-white">
                            {new Date(code.expires_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                    </div>

                    {code.used_by.length > 0 && (
                      <div>
                        <span className="text-white/60 text-sm">Utilisé par:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {code.used_by.map((username, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {username}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
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
                            Êtes-vous sûr de vouloir supprimer le code "{code.code}" ? Cette action est
                            irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCode(code.id)}
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

          {codes.length === 0 && (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucun code d'invitation trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}