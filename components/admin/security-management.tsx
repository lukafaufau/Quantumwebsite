"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Key,
  UserX,
  Activity,
  Globe,
  Clock,
  Ban,
  Unlock
} from "lucide-react"

interface SecurityEvent {
  id: number
  type: 'login' | 'failed_login' | 'password_change' | 'account_locked' | 'suspicious_activity'
  user: string
  ip: string
  timestamp: string
  details: string
  severity: 'low' | 'medium' | 'high'
}

interface SecuritySettings {
  maxLoginAttempts: number
  lockoutDuration: number
  passwordMinLength: number
  requireSpecialChars: boolean
  sessionTimeout: number
  twoFactorRequired: boolean
  ipWhitelist: string[]
  suspiciousActivityDetection: boolean
}

export function SecurityManagement() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [settings, setSettings] = useState<SecuritySettings>({
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 60,
    twoFactorRequired: false,
    ipWhitelist: [],
    suspiciousActivityDetection: true
  })
  const [loading, setLoading] = useState(true)
  const [newIp, setNewIp] = useState("")

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      // Simulate loading security events
      const mockEvents: SecurityEvent[] = [
        {
          id: 1,
          type: 'login',
          user: 'Wayzze',
          ip: '192.168.1.100',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          details: 'Connexion réussie',
          severity: 'low'
        },
        {
          id: 2,
          type: 'failed_login',
          user: 'unknown',
          ip: '45.123.45.67',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          details: 'Tentative de connexion échouée - mot de passe incorrect',
          severity: 'medium'
        },
        {
          id: 3,
          type: 'suspicious_activity',
          user: 'Player1',
          ip: '203.45.67.89',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          details: 'Connexion depuis un nouveau pays',
          severity: 'high'
        },
        {
          id: 4,
          type: 'password_change',
          user: '16k',
          ip: '192.168.1.101',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          details: 'Mot de passe modifié avec succès',
          severity: 'low'
        }
      ]
      setSecurityEvents(mockEvents)
    } catch (error) {
      console.error("Erreur lors du chargement des données de sécurité:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed_login':
        return <UserX className="h-4 w-4 text-red-400" />
      case 'password_change':
        return <Key className="h-4 w-4 text-blue-400" />
      case 'account_locked':
        return <Lock className="h-4 w-4 text-orange-400" />
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case 'medium':
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case 'low':
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'login':
        return 'Connexion'
      case 'failed_login':
        return 'Échec connexion'
      case 'password_change':
        return 'Changement MDP'
      case 'account_locked':
        return 'Compte verrouillé'
      case 'suspicious_activity':
        return 'Activité suspecte'
      default:
        return type
    }
  }

  const addIpToWhitelist = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      setSettings({
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIp]
      })
      setNewIp("")
    }
  }

  const removeIpFromWhitelist = (ip: string) => {
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter(item => item !== ip)
    })
  }

  const saveSettings = async () => {
    try {
      // In real app, save to backend
      alert("Paramètres de sécurité sauvegardés!")
    } catch (error) {
      alert("Erreur lors de la sauvegarde")
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des données de sécurité...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sécurité & Surveillance</h2>
          <p className="text-white/60">Gestion de la sécurité et monitoring des activités</p>
        </div>
        <Button
          onClick={saveSettings}
          className="bg-white text-black hover:bg-white/90"
        >
          <Shield className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      {/* Statistiques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-white/60">Connexions réussies</p>
                <p className="text-2xl font-bold text-white">
                  {securityEvents.filter(e => e.type === 'login').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-white/60">Tentatives échouées</p>
                <p className="text-2xl font-bold text-white">
                  {securityEvents.filter(e => e.type === 'failed_login').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white/60">Activités suspectes</p>
                <p className="text-2xl font-bold text-white">
                  {securityEvents.filter(e => e.type === 'suspicious_activity').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-white/60">Niveau sécurité</p>
                <p className="text-2xl font-bold text-white">Élevé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres de sécurité */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Paramètres de sécurité</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Configuration des règles de sécurité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxAttempts" className="text-white">
                  Tentatives max
                </Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    maxLoginAttempts: parseInt(e.target.value) || 5
                  })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lockoutDuration" className="text-white">
                  Durée verrouillage (min)
                </Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    lockoutDuration: parseInt(e.target.value) || 30
                  })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passwordLength" className="text-white">
                  Longueur MDP min
                </Label>
                <Input
                  id="passwordLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordMinLength: parseInt(e.target.value) || 8
                  })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout" className="text-white">
                  Timeout session (min)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    sessionTimeout: parseInt(e.target.value) || 60
                  })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="specialChars" className="text-white">
                  Caractères spéciaux requis
                </Label>
                <Switch
                  id="specialChars"
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    requireSpecialChars: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactor" className="text-white">
                  Authentification 2FA obligatoire
                </Label>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    twoFactorRequired: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="suspiciousDetection" className="text-white">
                  Détection activité suspecte
                </Label>
                <Switch
                  id="suspiciousDetection"
                  checked={settings.suspiciousActivityDetection}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    suspiciousActivityDetection: checked
                  })}
                />
              </div>
            </div>

            {/* Liste blanche IP */}
            <div>
              <Label className="text-white">Liste blanche IP</Label>
              <div className="space-y-2 mt-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="192.168.1.1"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Button
                    onClick={addIpToWhitelist}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {settings.ipWhitelist.map((ip, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-red-500/20"
                      onClick={() => removeIpFromWhitelist(ip)}
                    >
                      {ip} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal de sécurité */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Journal de sécurité</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Événements de sécurité récents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {securityEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="mt-0.5">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white">{event.details}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-white/60">
                      <span className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{event.ip}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(event.timestamp).toLocaleString("fr-FR")}</span>
                      </span>
                      <span>Utilisateur: {event.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>Actions de sécurité d'urgence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <Ban className="h-4 w-4 mr-2" />
              Verrouiller tous les comptes
            </Button>
            <Button
              variant="outline"
              className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
            >
              <Lock className="h-4 w-4 mr-2" />
              Mode maintenance
            </Button>
            <Button
              variant="outline"
              className="border-green-500/20 text-green-400 hover:bg-green-500/10"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Réinitialiser tentatives
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}