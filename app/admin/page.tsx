"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/auth"
import { AdminAPI } from "@/lib/admin-api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedUserManagement } from "@/components/admin/advanced-user-management"
import { TeamManagement } from "@/components/admin/team-management"
import { ApplicationManagement } from "@/components/admin/application-management"
import { AnnouncementManagement } from "@/components/admin/announcement-management"
import { InviteCodeManagement } from "@/components/admin/invite-code-management"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { SecurityManagement } from "@/components/admin/security-management"
import {
  Shield,
  Users,
  UserPlus,
  Trophy,
  Megaphone,
  Ticket,
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
  Monitor,
  Lock,
  AlertTriangle,
} from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
    if (user && !isAdmin(user)) router.push("/")
    loadStats()
  }, [user, isAuthenticated, router])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await AdminAPI.getStats()
      setStats(data)
    } catch (err) {
      console.error("Erreur stats:", err)
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
      alert("Sauvegarde créée avec succès !")
    } catch {
      alert("Erreur lors de la création de la sauvegarde")
    }
  }

  if (!isAuthenticated || !isAdmin(user)) return null
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Chargement du tableau de bord...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg animate-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-heading font-bold text-glow">NEMESIS ADMIN</h1>
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

          {/* Stats principales */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
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
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Équipes</CardTitle>
                <Trophy className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.teams?.total || 0}</div>
                <p className="text-xs text-green-400">{stats?.teams?.active || 0} actives</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">{stats?.teams?.recruiting || 0} recrutent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Candidatures</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.applications?.pending || 0}</div>
                <p className="text-xs text-purple-400">En attente</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs">{stats?.applications?.approved || 0} approuvées</Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">{stats?.applications?.rejected || 0} refusées</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Annonces</CardTitle>
                <Megaphone className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.announcements?.total || 0}</div>
                <p className="text-xs text-orange-400">{stats?.announcements?.visible || 0} visibles</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button onClick={createBackup} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white h-16">
              <Download className="h-5 w-5 mr-2" /> Créer une sauvegarde
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <Upload className="h-5 w-5 mr-2" /> Restaurer
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <BarChart3 className="h-5 w-5 mr-2" /> Rapports
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <Settings className="h-5 w-5 mr-2" /> Configuration
            </Button>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 bg-white/10 border-white/20">
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" /> Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="teams" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Trophy className="h-4 w-4 mr-2" /> Équipes
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <UserPlus className="h-4 w-4 mr-2" /> Candidatures
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Megaphone className="h-4 w-4 mr-2" /> Annonces
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="system" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Server className="h-4 w-4 mr-2" /> Système
              </TabsTrigger>
              <TabsTrigger value="invites" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Ticket className="h-4 w-4 mr-2" /> Invitations
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Monitor className="h-4 w-4 mr-2" /> Monitoring
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Lock className="h-4 w-4 mr-2" /> Sécurité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users"><AdvancedUserManagement /></TabsContent>
            <TabsContent value="teams"><TeamManagement /></TabsContent>
            <TabsContent value="applications"><ApplicationManagement /></TabsContent>
            <TabsContent value="announcements"><AnnouncementManagement /></TabsContent>
            <TabsContent value="analytics">
              {/* Analytics cards */}
            </TabsContent>
            <TabsContent value="system">
              {/* System monitoring */}
            </TabsContent>
            <TabsContent value="invites"><InviteCodeManagement /></TabsContent>
            <TabsContent value="monitoring"><SystemMonitoring /></TabsContent>
            <TabsContent value="security"><SecurityManagement /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/auth"
import { AdminAPI } from "@/lib/admin-api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedUserManagement } from "@/components/admin/advanced-user-management"
import { TeamManagement } from "@/components/admin/team-management"
import { ApplicationManagement } from "@/components/admin/application-management"
import { AnnouncementManagement } from "@/components/admin/announcement-management"
import { InviteCodeManagement } from "@/components/admin/invite-code-management"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { SecurityManagement } from "@/components/admin/security-management"
import {
  Shield,
  Users,
  UserPlus,
  Trophy,
  Megaphone,
  Ticket,
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
  Monitor,
  Lock,
  AlertTriangle,
} from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
    if (user && !isAdmin(user)) router.push("/")
    loadStats()
  }, [user, isAuthenticated, router])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await AdminAPI.getStats()
      setStats(data)
    } catch (err) {
      console.error("Erreur stats:", err)
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
      alert("Sauvegarde créée avec succès !")
    } catch {
      alert("Erreur lors de la création de la sauvegarde")
    }
  }

  if (!isAuthenticated || !isAdmin(user)) return null
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Chargement du tableau de bord...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg animate-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-heading font-bold text-glow">NEMESIS ADMIN</h1>
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

          {/* Stats principales */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
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
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Équipes</CardTitle>
                <Trophy className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.teams?.total || 0}</div>
                <p className="text-xs text-green-400">{stats?.teams?.active || 0} actives</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">{stats?.teams?.recruiting || 0} recrutent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Candidatures</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.applications?.pending || 0}</div>
                <p className="text-xs text-purple-400">En attente</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs">{stats?.applications?.approved || 0} approuvées</Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">{stats?.applications?.rejected || 0} refusées</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-white/20 hover-lift animate-scale-in">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Annonces</CardTitle>
                <Megaphone className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white text-glow">{stats?.announcements?.total || 0}</div>
                <p className="text-xs text-orange-400">{stats?.announcements?.visible || 0} visibles</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button onClick={createBackup} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white h-16">
              <Download className="h-5 w-5 mr-2" /> Créer une sauvegarde
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <Upload className="h-5 w-5 mr-2" /> Restaurer
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <BarChart3 className="h-5 w-5 mr-2" /> Rapports
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16">
              <Settings className="h-5 w-5 mr-2" /> Configuration
            </Button>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 bg-white/10 border-white/20">
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" /> Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="teams" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Trophy className="h-4 w-4 mr-2" /> Équipes
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <UserPlus className="h-4 w-4 mr-2" /> Candidatures
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Megaphone className="h-4 w-4 mr-2" /> Annonces
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="system" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Server className="h-4 w-4 mr-2" /> Système
              </TabsTrigger>
              <TabsTrigger value="invites" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Ticket className="h-4 w-4 mr-2" /> Invitations
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Monitor className="h-4 w-4 mr-2" /> Monitoring
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                <Lock className="h-4 w-4 mr-2" /> Sécurité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users"><AdvancedUserManagement /></TabsContent>
            <TabsContent value="teams"><TeamManagement /></TabsContent>
            <TabsContent value="applications"><ApplicationManagement /></TabsContent>
            <TabsContent value="announcements"><AnnouncementManagement /></TabsContent>
            <TabsContent value="analytics">
              {/* Analytics cards */}
            </TabsContent>
            <TabsContent value="system">
              {/* System monitoring */}
            </TabsContent>
            <TabsContent value="invites"><InviteCodeManagement /></TabsContent>
            <TabsContent value="monitoring"><SystemMonitoring /></TabsContent>
            <TabsContent value="security"><SecurityManagement /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
