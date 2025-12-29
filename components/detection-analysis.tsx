"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Brain, Clock, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DetectionAnalysis() {
  const detections = [
    {
      id: 1,
      location: "Quartier M'hannech - Intersection Place Al Jala",
      severity: "rouge-critique",
      type: "Accident avec blessés",
      vehiclesImpacted: 450,
      duration: "15 min",
      trend: "propagation",
      detectedAt: "14:23:45",
    },
    {
      id: 2,
      location: "Route de Martil - Sortie Nord",
      severity: "rouge",
      type: "Congestion sévère",
      vehiclesImpacted: 280,
      duration: "8 min",
      trend: "stable",
      detectedAt: "14:25:12",
    },
    {
      id: 3,
      location: "Avenue Hassan II",
      severity: "orange",
      type: "Ralentissement",
      vehiclesImpacted: 120,
      duration: "3 min",
      trend: "résolution",
      detectedAt: "14:27:30",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "rouge-critique":
        return "destructive"
      case "rouge":
        return "destructive"
      case "orange":
        return "default"
      default:
        return "secondary"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "rouge-critique":
        return "bg-red-50 border-red-200 dark:bg-red-950/20"
      case "rouge":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20"
      case "orange":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="h-6 w-6" />
            {"Processus 2 : DÉTECTION & ANALYSE"}
          </CardTitle>
          <CardDescription className="text-orange-50">
            {"Intelligence artificielle pour détecter et analyser les congestions en temps réel"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Analysis Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Temps Détection"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"< 1min"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: < 1 minute"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Taux Fausses Alertes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"3.2%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: < 5%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Précision Prédiction"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"89%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 85%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Détections Actives"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{detections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Nécessitant action"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Detections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            {"Détections & Classifications en Cours"}
          </CardTitle>
          <CardDescription>{"Analyse automatique via Machine Learning et Deep Learning"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {detections.map((detection) => (
            <Alert key={detection.id} className={getSeverityBg(detection.severity)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span className="font-semibold">{detection.location}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(detection.severity)} className="uppercase">
                    {detection.severity}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {detection.detectedAt}
                  </Badge>
                </div>
              </AlertTitle>
              <AlertDescription className="mt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">{"Type"}</p>
                    <p className="font-medium">{detection.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{"Véhicules Impactés"}</p>
                    <p className="font-medium">{detection.vehiclesImpacted}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{"Durée"}</p>
                    <p className="font-medium">{detection.duration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{"Tendance"}</p>
                    <p className="font-medium capitalize flex items-center gap-1">
                      {detection.trend}
                      {detection.trend === "propagation" && <TrendingUp className="h-3 w-3 text-red-600" />}
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* AI Analysis Methods */}
      <Card>
        <CardHeader>
          <CardTitle>{"Méthodes d'Analyse IA Déployées"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-2">{"Comparaison Historique"}</h4>
              <p className="text-sm text-muted-foreground">
                {"Analyse des patterns par rapport aux modèles historiques"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-2">{"Détection d'Outliers"}</h4>
              <p className="text-sm text-muted-foreground">
                {"Identification des anomalies et comportements atypiques"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-2">{"Reconnaissance Patterns"}</h4>
              <p className="text-sm text-muted-foreground">{"Deep Learning pour identifier les tendances complexes"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
