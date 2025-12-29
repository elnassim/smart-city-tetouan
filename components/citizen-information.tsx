"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Smartphone, RadioIcon, MessageSquare, TrendingUp, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CitizenInformation() {
  const alerts = [
    {
      id: 1,
      type: "Alerte",
      title: "Accident route de Martil",
      message: "Déviation conseillée via Boulevard Hassan II",
      channels: ["App Mobile", "Panneaux", "SMS"],
      reach: 3240,
      engagement: 68,
      sentAt: "14:25",
    },
    {
      id: 2,
      type: "Recommandation",
      title: "Itinéraire alternatif disponible",
      message: "Évitez Centre-ville - Gain estimé: 12 minutes",
      channels: ["App Mobile", "API Waze"],
      reach: 1580,
      engagement: 52,
      sentAt: "14:28",
    },
    {
      id: 3,
      type: "Prévention",
      title: "Manifestation prévue 15h",
      message: "Éviter centre-ville entre 15h et 17h",
      channels: ["App Mobile", "Réseaux Sociaux", "Radio"],
      reach: 8920,
      engagement: 74,
      sentAt: "13:00",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6" />
            {"Processus 4 : INFORMATION CITOYENS"}
          </CardTitle>
          <CardDescription className="text-cyan-50">
            {"Communication proactive pour permettre aux usagers d'adapter leurs déplacements"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Délai Diffusion"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"< 2min"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Après détection incident"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Taux Engagement App"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"68%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 60%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Adoption Recommandations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"54%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 50%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Satisfaction Usagers"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{"4.3/5"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 4/5"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-600" />
              {"Alertes & Notifications Actives"}
            </span>
            <Button size="sm">
              <Bell className="h-4 w-4 mr-2" />
              {"Nouvelle Alerte"}
            </Button>
          </CardTitle>
          <CardDescription>{"Diffusion multi-canal automatisée et personnalisée"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className="border-l-4 border-l-cyan-500">
              <MapPin className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span className="font-semibold">{alert.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.type === "Alerte" ? "destructive" : "secondary"}>{alert.type}</Badge>
                  <Badge variant="outline">{alert.sentAt}</Badge>
                </div>
              </AlertTitle>
              <AlertDescription className="mt-3 space-y-3">
                <p className="text-sm">{alert.message}</p>
                <div className="flex flex-wrap gap-2">
                  {alert.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">{"Portée"}</p>
                    <p className="font-semibold">
                      {alert.reach.toLocaleString()} {"usagers"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{"Engagement"}</p>
                    <p className="font-semibold flex items-center gap-1">
                      {alert.engagement}%
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle>{"Canaux de Diffusion Multi-Canal"}</CardTitle>
          <CardDescription>{"Maximiser la portée avec diffusion simultanée sur plusieurs plateformes"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[
              { icon: Smartphone, name: "Application Mobile", desc: "Push + Carte interactive" },
              { icon: RadioIcon, name: "Panneaux Intelligents", desc: "Messages lumineux variables" },
              { icon: MessageSquare, name: "SMS", desc: "Abonnés service alertes" },
              { icon: Bell, name: "Réseaux Sociaux", desc: "Twitter/Facebook ville" },
              { icon: RadioIcon, name: "Radio Locale", desc: "Partenariat médias" },
              { icon: MapPin, name: "API Publique", desc: "Waze, Google Maps" },
            ].map((channel) => (
              <div key={channel.name} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <channel.icon className="h-8 w-8 text-cyan-600 mb-2" />
                <h4 className="font-semibold mb-1">{channel.name}</h4>
                <p className="text-xs text-muted-foreground">{channel.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
