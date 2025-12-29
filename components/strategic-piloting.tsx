"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Users, Zap, Leaf } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function StrategicPiloting() {
  const trafficTrendData = [
    { month: "Jan", avgSpeed: 38, congestion: 28, incidents: 45 },
    { month: "Fév", avgSpeed: 40, congestion: 25, incidents: 38 },
    { month: "Mar", avgSpeed: 42, congestion: 22, incidents: 32 },
    { month: "Avr", avgSpeed: 45, congestion: 18, incidents: 28 },
    { month: "Mai", avgSpeed: 47, congestion: 16, incidents: 24 },
    { month: "Jun", avgSpeed: 48, congestion: 14, incidents: 20 },
  ]

  const performanceData = [
    { metric: "Détection", current: 95, target: 90 },
    { metric: "Régulation", current: 88, target: 85 },
    { metric: "Information", current: 68, target: 60 },
    { metric: "Intervention", current: 86, target: 80 },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-violet-600 to-purple-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {"Processus 8 : PILOTAGE STRATÉGIQUE"}
          </CardTitle>
          <CardDescription className="text-violet-50">
            {"Supervision globale, mesure de performance et amélioration continue du système"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {"Vitesse Moyenne"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-blue-600">48</div>
              <div className="text-sm text-muted-foreground pb-1">km/h</div>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+26%</span>
              <span className="text-muted-foreground text-xs">{"vs année dernière"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {"Taux de Congestion"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-green-600">14</div>
              <div className="text-sm text-muted-foreground pb-1">%</div>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">-50%</span>
              <span className="text-muted-foreground text-xs">{"vs année dernière"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {"Satisfaction Usagers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-purple-600">4.3</div>
              <div className="text-sm text-muted-foreground pb-1">/5</div>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+0.6</span>
              <span className="text-muted-foreground text-xs">{"vs trimestre dernier"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              {"Réduction CO₂"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-emerald-600">-18</div>
              <div className="text-sm text-muted-foreground pb-1">%</div>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{"Objectif atteint"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-600" />
            {"Évolution des Indicateurs de Trafic"}
          </CardTitle>
          <CardDescription>{"Analyse des tendances sur les 6 derniers mois"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgSpeed" stroke="#3b82f6" strokeWidth={2} name="Vitesse Moyenne (km/h)" />
              <Line type="monotone" dataKey="congestion" stroke="#ef4444" strokeWidth={2} name="Congestion (%)" />
              <Line type="monotone" dataKey="incidents" stroke="#f59e0b" strokeWidth={2} name="Incidents (nombre)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Process Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            {"Performance par Processus"}
          </CardTitle>
          <CardDescription>{"Comparaison performance actuelle vs objectifs fixés"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#8b5cf6" name="Performance Actuelle (%)" />
              <Bar dataKey="target" fill="#d8b4fe" name="Objectif (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continuous Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            {"Axes d'Amélioration Continue"}
          </CardTitle>
          <CardDescription>{"Démarche d'optimisation et benchmarking des meilleures pratiques"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Optimisation Algorithmes IA",
                desc: "Ajustement des paramètres de détection pour réduire les fausses alertes",
                status: "En cours",
                impact: "+12% précision",
              },
              {
                title: "Positionnement Capteurs",
                desc: "Analyse des zones à faible couverture et redéploiement stratégique",
                status: "Planifié",
                impact: "+8% couverture",
              },
              {
                title: "Contenus Communications",
                desc: "Personnalisation messages selon profil usager et contexte",
                status: "Test A/B",
                impact: "+15% engagement",
              },
              {
                title: "Formation Agents Terrain",
                desc: "Programme de formation continue sur nouveaux outils et procédures",
                status: "Déployé",
                impact: "+20% efficacité",
              },
            ].map((improvement, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">{improvement.title}</h4>
                  <Badge
                    variant={
                      improvement.status === "Déployé"
                        ? "secondary"
                        : improvement.status === "En cours"
                          ? "default"
                          : "outline"
                    }
                    className={improvement.status === "Déployé" ? "bg-green-100 text-green-800" : ""}
                  >
                    {improvement.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{improvement.desc}</p>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {improvement.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reporting Schedule */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { period: "Quotidien", target: "Superviseurs", type: "Dashboard Op." },
          { period: "Hebdomadaire", target: "Direction Mobilité", type: "Rapport Synth." },
          { period: "Mensuel", target: "Direction Générale", type: "Analyse Détaillée" },
          { period: "Annuel", target: "Élus & Public", type: "Bilan Global" },
        ].map((report) => (
          <Card key={report.period}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{report.period}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">{"Destinataire:"}</p>
              <p className="font-semibold text-sm">{report.target}</p>
              <Badge variant="outline" className="text-xs mt-2">
                {report.type}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
