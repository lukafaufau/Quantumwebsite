"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Wifi,
  Shield
} from "lucide-react"

interface SystemStats {
  cpu: {
    usage: number
    cores: number
    temperature: number
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  network: {
    upload: number
    download: number
    latency: number
  }
  database: {
    connections: number
    queries: number
    size: number
  }
  uptime: number
  lastBackup: string
  version: string
}

export function SystemMonitoring() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadSystemStats()
    const interval = setInterval(loadSystemStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadSystemStats = async () => {
    try {
      setLoading(true)
      // Simulate system stats - in real app, this would come from your monitoring API
      const mockStats: SystemStats = {
        cpu: {
          usage: Math.floor(Math.random() * 80) + 10,
          cores: 8,
          temperature: Math.floor(Math.random() * 20) + 45
        },
        memory: {
          used: Math.floor(Math.random() * 8) + 4,
          total: 16,
          percentage: 0
        },
        disk: {
          used: Math.floor(Math.random() * 200) + 100,
          total: 500,
          percentage: 0
        },
        network: {
          upload: Math.floor(Math.random() * 100) + 10,
          download: Math.floor(Math.random() * 500) + 50,
          latency: Math.floor(Math.random() * 50) + 10
        },
        database: {
          connections: Math.floor(Math.random() * 50) + 10,
          queries: Math.floor(Math.random() * 1000) + 100,
          size: Math.floor(Math.random() * 500) + 100
        },
        uptime: Math.floor(Math.random() * 30) + 1,
        lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        version: "2.1.0"
      }

      mockStats.memory.percentage = Math.round((mockStats.memory.used / mockStats.memory.total) * 100)
      mockStats.disk.percentage = Math.round((mockStats.disk.used / mockStats.disk.total) * 100)

      setStats(mockStats)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques système:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshStats = async () => {
    setRefreshing(true)
    await loadSystemStats()
  }

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return "text-green-400"
    if (percentage < 80) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage < 80) return <CheckCircle className="h-4 w-4 text-green-400" />
    return <AlertTriangle className="h-4 w-4 text-red-400" />
  }

  if (loading && !stats) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des statistiques système...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoring Système</h2>
          <p className="text-white/60">Surveillance en temps réel de l'infrastructure</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={refreshStats}
            disabled={refreshing}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Statut général */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Statut Serveur</p>
                <p className="text-xl font-bold text-green-400">Opérationnel</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-white/60">Uptime</p>
                <p className="text-xl font-bold text-white">{stats?.uptime || 0}j</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-white/60">Version</p>
                <p className="text-xl font-bold text-white">{stats?.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-white/60">Dernière Sauvegarde</p>
                <p className="text-sm font-bold text-white">
                  {stats?.lastBackup ? new Date(stats.lastBackup).toLocaleDateString("fr-FR") : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>Processeur</span>
              {stats && getStatusIcon(stats.cpu.usage)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Utilisation CPU</span>
                <span className={`font-bold ${stats ? getStatusColor(stats.cpu.usage) : 'text-white'}`}>
                  {stats?.cpu.usage || 0}%
                </span>
              </div>
              <Progress value={stats?.cpu.usage || 0} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Cœurs:</span>
                <span className="ml-2 text-white">{stats?.cpu.cores || 0}</span>
              </div>
              <div>
                <span className="text-white/60">Température:</span>
                <span className="ml-2 text-white">{stats?.cpu.temperature || 0}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mémoire */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MemoryStick className="h-5 w-5" />
              <span>Mémoire</span>
              {stats && getStatusIcon(stats.memory.percentage)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Utilisation RAM</span>
                <span className={`font-bold ${stats ? getStatusColor(stats.memory.percentage) : 'text-white'}`}>
                  {stats?.memory.percentage || 0}%
                </span>
              </div>
              <Progress value={stats?.memory.percentage || 0} className="h-2" />
            </div>
            <div className="text-sm">
              <span className="text-white/60">Utilisée:</span>
              <span className="ml-2 text-white">
                {stats?.memory.used || 0} GB / {stats?.memory.total || 0} GB
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stockage */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Stockage</span>
              {stats && getStatusIcon(stats.disk.percentage)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Espace utilisé</span>
                <span className={`font-bold ${stats ? getStatusColor(stats.disk.percentage) : 'text-white'}`}>
                  {stats?.disk.percentage || 0}%
                </span>
              </div>
              <Progress value={stats?.disk.percentage || 0} className="h-2" />
            </div>
            <div className="text-sm">
              <span className="text-white/60">Utilisé:</span>
              <span className="ml-2 text-white">
                {stats?.disk.used || 0} GB / {stats?.disk.total || 0} GB
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Réseau */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Réseau</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 text-blue-400" />
                <div>
                  <span className="text-white/60">Upload:</span>
                  <span className="ml-2 text-white">{stats?.network.upload || 0} MB/s</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-green-400" />
                <div>
                  <span className="text-white/60">Download:</span>
                  <span className="ml-2 text-white">{stats?.network.download || 0} MB/s</span>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-white/60">Latence:</span>
              <span className="ml-2 text-white">{stats?.network.latency || 0} ms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Base de données */}
      <Card className="bg-black border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Base de données</span>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats?.database.connections || 0}</div>
              <div className="text-sm text-white/60">Connexions actives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats?.database.queries || 0}</div>
              <div className="text-sm text-white/60">Requêtes/min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats?.database.size || 0} MB</div>
              <div className="text-sm text-white/60">Taille de la DB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes système */}
      <Card className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span>Alertes et Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Tous les services fonctionnent normalement</p>
                <p className="text-xs text-white/60">Il y a 2 minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Sauvegarde automatique effectuée</p>
                <p className="text-xs text-white/60">Il y a 1 heure</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Maintenance programmée dans 7 jours</p>
                <p className="text-xs text-white/60">Il y a 3 heures</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}