"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/auth"
import { AdminAPI } from "@/lib/admin-api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedUserManagement } from "@/components/admin/advanced-user-management"
import { TeamManagement } from "@/components/admin/team-management"
import { ApplicationManagement } from "@/components/admin/application-management"
import { AnnouncementManagement } from "@/components/admin/announcement-management"
import {
  Shield,
  Users,
  UserPlus,
  Trophy,
  Megaphone,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  HardDrive,
  Cpu,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isAdmin(user)) {
      router.push("/")
      return
    }

    loadStats()
  }, [user, isAuthenticated, router])

  const loadStats = async () => {
    try {
      setLoading(true)
      const statsData = await AdminAPI.getStats()
      setStats(statsData)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    setRefreshing(true)
    await loadStats()
    setRefreshing(false)
  }

  const createBackup = async () => {
    try {
      await AdminAPI.createBackup()
      alert("Sauvegarde créée avec succès!")
    } catch (error) {
      alert("Erreur lors de la création de la sauvegarde")
    }
  }

  if (!isAuthenticated || !isAdmin(user)) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* En-tête avec animations */}
          <div className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg animate-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-heading font-bold text-glow">QUANTUM ADMIN</h1>
                <p className="text-white/60 text-lg">Tableau de bord administrateur avancé</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 animate-pulse-slow">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {user?.username}
              </Badge>
              <Button
                onClick={refreshStats}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Statistiques principales */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.users?.total || 0}</div>
                <p className="text-xs text-blue-400">+{stats?.users?.todaySignups || 0} aujourd'hui</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs">{stats?.users?.active || 0} actifs</Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">{stats?.users?.banned || 0} bannis</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Équipes</CardTitle>
                <Trophy className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.teams?.total || 0}</div>
                <p className="text-xs text-green-400">{stats?.teams?.active || 0} actives</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                    {stats?.teams?.recruiting || 0} recrutent
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Candidatures</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.applications?.pending || 0}</div>
                <p className="text-xs text-purple-400">En attente</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {stats?.applications?.approved || 0} approuvées
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">
                    {stats?.applications?.rejected || 0} refusées
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Annonces</CardTitle>
                <Megaphone className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.announcements?.total || 0}</div>
                <p className="text-xs text-orange-400">{stats?.announcements?.visible || 0} visibles</p>
              </CardContent>
            </Card>
          </div>

          {/* Métriques système */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-white/20 animate-fade-in">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Server className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-white/60">Serveur</span>
                    </div>
                    <div className="text-2xl font-bold text-white">Opérationnel</div>
                    <p className="text-xs text-cyan-400">Uptime: {stats?.system?.uptime || 0} jours</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-white/20 animate-fade-in">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <HardDrive className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-white/60">Stockage</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.system?.diskUsage || 0}%</div>
                    <p className="text-xs text-yellow-400">Utilisé</p>
                  </div>
                  <div className="w-12 h-12 relative">
                    <div className="w-full h-full bg-white/10 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden">
                      <div
                        className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transform origin-center"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (stats?.system?.diskUsage || 0) * 0.5}% 0%, 100% 100%, 0% 100%)`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-white/20 animate-fade-in">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Cpu className="h-5 w-5 text-pink-400" />
                      <span className="text-sm text-white/60">CPU</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.system?.cpuUsage || 0}%</div>
                    <p className="text-xs text-pink-400">Utilisation</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {Array.from({ length: 5 }, (_, i) => {
                      const isActive = i < Math.floor((stats?.system?.cpuUsage || 0) / 20)
                      return (
                        <div
                          key={i}
                          className={`w-8 h-1 rounded transition-colors duration-300 ${
                            isActive ? "bg-pink-400" : "bg-white/10"
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={createBackup}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-16"
            >
              <Download className="h-5 w-5 mr-2" />
              Créer une sauvegarde
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 bg-transparent">
              <Upload className="h-5 w-5 mr-2" />
              Restaurer
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 bg-transparent">
              <BarChart3 className="h-5 w-5 mr-2" />
              Rapports
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 bg-transparent">
              <Settings className="h-5 w-5 mr-2" />
              Configuration
            </Button>
          </div>

          {/* Onglets de gestion */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/10 border-white/20">
              <TabsTrigger
                value="users"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Équipes
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Candidatures
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Megaphone className="h-4 w-4 mr-2" />
                Annonces
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Server className="h-4 w-4 mr-2" />
                Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <AdvancedUserManagement />
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <ApplicationManagement />
            </TabsContent>

            <TabsContent value="announcements" className="space-y-6">
              <AnnouncementManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Répartition des utilisateurs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(stats?.users?.byRole || {}).map(([role, count]) => {
                        const percentage = ((count as number) / (stats?.users?.total || 1)) * 100
                        return (
                          <div key={role} className="flex items-center justify-between">
                            <span className="text-white capitalize">{role}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                                />
                              </div>
                              <span className="text-white/60 text-sm">{count as number}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <LineChart className="h-5 w-5" />
                      <span>Activité récente</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-white text-sm">Nouvelles inscriptions</span>
                        </div>
                        <span className="text-green-400 font-semibold">+{stats?.users?.todaySignups || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-white text-sm">Candidatures</span>
                        </div>
                        <span className="text-blue-400 font-semibold">
                          +{stats?.applications?.todayApplications || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-white text-sm">Utilisateurs actifs</span>
                        </div>
                        <span className="text-purple-400 font-semibold">{stats?.users?.active || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>État du système</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Version</span>
                      <Badge className="bg-blue-500/20 text-blue-400">{stats?.system?.version}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Dernière sauvegarde</span>
                      <span className="text-white/60 text-sm">
                        {stats?.system?.lastBackup ? new Date(stats.system.lastBackup).toLocaleDateString() : "Jamais"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Mémoire</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, stats?.system?.memoryUsage || 0))}%` }}
                          />
                        </div>
                        <span className="text-white/60 text-sm">{stats?.system?.memoryUsage || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Logs récents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        <span>Système démarré avec succès</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-400">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>Base de données connectée</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/60">
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        <span>Sauvegarde automatique programmée</span>
                      </div>
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span>Maintenance programmée dans 7 jours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border-red-500/20">
                <CardContent className="py-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-medium text-red-400">Zone d'administration critique</p>
                      <p className="text-sm text-red-400/80 mt-1">
                        Vous avez accès à toutes les fonctionnalités d'administration. Les modifications effectuées ici
                        affectent l'ensemble de la plateforme et tous les utilisateurs. Procédez avec précaution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
