"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { UserPlus, Check, X, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

interface Application {
  id: number
  username: string
  discord_id: string
  role: string
  game: string
  status: "pending" | "accepted" | "rejected"
  message?: string
  experience?: string
  availability?: string
  date: string
}

export function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/recruitment")
      const data = await response.json()
      if (data.success) {
        setApplications(data.data || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des candidatures:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: "accepted" | "rejected") => {
    try {
      const response = await fetch(`/api/recruitment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status, 
          reviewed_by: "Admin",
          reviewed_at: new Date().toISOString()
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchApplications()
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la mise à jour de la candidature")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Acceptée"
      case "rejected":
        return "Refusée"
      default:
        return "En attente"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des candidatures...
      </div>
    )
  }

  const pendingApplications = applications.filter(app => app.status === "pending")
  const processedApplications = applications.filter(app => app.status !== "pending")

  return (
    <div className="space-y-6">
      {/* Candidatures en attente */}
      <Card className="bg-black border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Candidatures en attente</span>
            <Badge className="bg-yellow-500/20 text-yellow-400">
              {pendingApplications.length}
            </Badge>
          </CardTitle>
          <CardDescription className="text-white/60">
            Examinez et traitez les nouvelles candidatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune candidature en attente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <Card key={application.id} className="border-l-4 border-l-yellow-500 bg-white/5 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-white">{application.username}</h4>
                          <Badge variant="secondary">{application.game}</Badge>
                          <Badge variant="outline">{application.role}</Badge>
                          <Badge variant="outline" className={getStatusColor(application.status)}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{getStatusText(application.status)}</span>
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Discord:</span>
                            <span className="ml-2 font-mono text-xs text-white">{application.discord_id}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Date:</span>
                            <span className="ml-2 text-white">
                              {new Date(application.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>

                        {application.message && (
                          <div>
                            <span className="text-white/60 text-sm">Message:</span>
                            <p className="text-sm text-white mt-1 bg-white/5 p-2 rounded">
                              {application.message}
                            </p>
                          </div>
                        )}

                        {application.experience && (
                          <div>
                            <span className="text-white/60 text-sm">Expérience:</span>
                            <p className="text-sm text-white mt-1 bg-white/5 p-2 rounded">
                              {application.experience}
                            </p>
                          </div>
                        )}

                        {application.availability && (
                          <div>
                            <span className="text-white/60 text-sm">Disponibilités:</span>
                            <p className="text-sm text-white mt-1 bg-white/5 p-2 rounded">
                              {application.availability}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-black border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Accepter la candidature</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                Êtes-vous sûr de vouloir accepter la candidature de {application.username} ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleUpdateStatus(application.id, "accepted")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accepter
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <X className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-black border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Refuser la candidature</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                Êtes-vous sûr de vouloir refuser la candidature de {application.username} ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleUpdateStatus(application.id, "rejected")}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Refuser
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
          )}
        </CardContent>
      </Card>

      {/* Candidatures traitées */}
      <Card className="bg-black border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Candidatures traitées</span>
            <Badge variant="secondary">{processedApplications.length}</Badge>
          </CardTitle>
          <CardDescription className="text-white/60">
            Historique des candidatures acceptées et refusées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processedApplications.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune candidature traitée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedApplications.map((application) => (
                <Card key={application.id} className={`border-l-4 ${
                  application.status === "accepted" ? "border-l-green-500" : "border-l-red-500"
                } bg-white/5 border-white/20`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-white">{application.username}</h4>
                          <Badge variant="secondary">{application.game}</Badge>
                          <Badge variant="outline">{application.role}</Badge>
                          <Badge variant="outline" className={getStatusColor(application.status)}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{getStatusText(application.status)}</span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>Discord: {application.discord_id}</span>
                          <span>Date: {new Date(application.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}