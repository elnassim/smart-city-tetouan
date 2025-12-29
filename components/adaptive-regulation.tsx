"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Radio, Clock, Activity, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function AdaptiveRegulation() {
  const trafficLights = [
    {
      id: "TL-001",
      location: "Place Al Jala - Intersection Nord",
      mode: "Adaptatif",
      currentCycle: 65,
      optimalCycle: 75,
      efficiency: 92,
      status: "Ajustement en cours",
      lastUpdate: "30s",
    },
    {
      id: "TL-002",
      location: "Avenue Mohammed V - Carrefour Central",
      mode: "Onde Verte Urgence",
      currentCycle: 90,
      optimalCycle: 90,
      efficiency: 98,
      status: "Véhicule urgence détecté",
      lastUpdate: "5s",
    },
    {
      id: "TL-003",
      location: "Route de Martil - Sortie Ville",
      mode: "Adaptatif",
      currentCycle: 55,
      optimalCycle: 55,
      efficiency: 88,
      status: "Optimal",
      lastUpdate: "12s",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Radio className="h-6 w-6" />
            {"Processus 3 : RÉGULATION ADAPTATIVE"}
          </CardTitle>
          <CardDescription className="text-purple-50">
            {"Ajustement automatique des feux de signalisation pour optimiser les flux en temps réel"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Réduction Temps Attente"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"-30%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"vs système traditionnel"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Amélioration Fluidité"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"+40%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Débit carrefours"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Temps Réponse Cycle"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"< 10s"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Changement effectif"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Onde Verte Urgence"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{"< 5s"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Création automatique"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Traffic Light Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-purple-600" />
              {"Contrôleurs de Feux Intelligents"}
            </span>
            <Button size="sm" variant="outline">
              {"Vue Cartographique"}
            </Button>
          </CardTitle>
          <CardDescription>{"Calcul automatique des cycles optimaux et coordination inter-carrefours"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trafficLights.map((light) => (
            <div key={light.id} className="p-4 rounded-lg border bg-card space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{light.location}</h4>
                    <Badge variant="outline" className="text-xs">
                      {light.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant={light.mode === "Onde Verte Urgence" ? "destructive" : "secondary"}>
                      {light.mode}
                    </Badge>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {"Mis à jour il y a"} {light.lastUpdate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {light.status === "Optimal" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Activity className="h-5 w-5 text-orange-600 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Cycle Actuel"}</p>
                  <p className="text-2xl font-bold">{light.currentCycle}s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Cycle Optimal"}</p>
                  <p className="text-2xl font-bold text-blue-600">{light.optimalCycle}s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Efficacité"}</p>
                  <p className="text-2xl font-bold text-green-600">{light.efficiency}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{"Progression ajustement"}</span>
                  <span className="font-medium">{light.status}</span>
                </div>
                <Progress value={(light.currentCycle / light.optimalCycle) * 100} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Coordination Info */}
      <Card>
        <CardHeader>
          <CardTitle>{"Coordination Inter-Carrefours"}</CardTitle>
          <CardDescription>{"Synchronisation pour créer des ondes vertes et optimiser la circulation"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {"Onde Verte Active"}
              </h4>
              <p className="text-sm text-muted-foreground">{"Avenue Hassan II: 3 carrefours synchronisés"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {"Ajustement Progressif"}
              </h4>
              <p className="text-sm text-muted-foreground">{"Max ±20% par cycle pour éviter confusion"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                {"Mode Sécurisé"}
              </h4>
              <p className="text-sm text-muted-foreground">{"Basculement automatique en cas de panne"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
