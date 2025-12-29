"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation, TrendingUp, Clock, Fuel, MapPin, ArrowRight } from "lucide-react"

export default function RouteManagement() {
  const alternativeRoutes = [
    {
      id: "ALT-001",
      from: "Centre-ville",
      to: "Route de Martil",
      mainRoute: { name: "Avenue Mohammed V", time: 28, distance: 8.5, capacity: 5 },
      altRoute: { name: "Boulevard Hassan II", time: 16, distance: 9.2, capacity: 68 },
      timeSaved: 12,
      adopted: 54,
      totalUsers: 89,
    },
    {
      id: "ALT-002",
      from: "Quartier M'hannech",
      to: "Zone Industrielle",
      mainRoute: { name: "Route Directe", time: 22, distance: 6.8, capacity: 12 },
      altRoute: { name: "Périphérique Nord", time: 19, distance: 8.1, capacity: 75 },
      timeSaved: 3,
      adopted: 41,
      totalUsers: 67,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            {"Processus 6 : GESTION ITINÉRAIRES"}
          </CardTitle>
          <CardDescription className="text-emerald-50">
            {"Optimisation dynamique des flux par proposition d'alternatives intelligentes"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Adoption Recommandations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"54%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 50%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Réduction Temps Trajet"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"-20%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Moyenne usagers"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Équilibrage Charge"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"74%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 70%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Précision Estimations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{"±4min"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: ±5 minutes"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-600" />
              {"Itinéraires Alternatifs Actifs"}
            </span>
            <Button size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              {"Vue Cartographique"}
            </Button>
          </CardTitle>
          <CardDescription>
            {"Calcul temps réel selon critères multiples (temps, distance, confort, éco-responsable)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {alternativeRoutes.map((route) => (
            <div key={route.id} className="p-6 rounded-lg border bg-gradient-to-br from-card to-accent/5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className="mb-2">
                    {route.id}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{route.from}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-sm">{route.to}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{"Adoption"}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-green-600">{route.adopted}%</p>
                    <Badge variant="secondary" className="text-xs">
                      {route.totalUsers} {"usagers"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Main Route */}
                <div className="p-4 rounded-lg border bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-900 dark:text-red-400">{"Itinéraire Principal"}</h4>
                    <Badge variant="destructive" className="text-xs">
                      {"Saturé à"} {route.mainRoute.capacity}%
                    </Badge>
                  </div>
                  <p className="font-medium mb-3">{route.mainRoute.name}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span className="font-semibold">{route.mainRoute.time} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="font-semibold">{route.mainRoute.distance} km</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Route */}
                <div className="p-4 rounded-lg border bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-green-900 dark:text-green-400">{"Itinéraire Alternatif"}</h4>
                    <Badge className="text-xs bg-green-600">
                      {"Disponible à"} {route.altRoute.capacity}%
                    </Badge>
                  </div>
                  <p className="font-medium mb-3">{route.altRoute.name}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{route.altRoute.time} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{route.altRoute.distance} km</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-semibold text-lg">
                  {"Gain estimé: "} {route.timeSaved} {"minutes"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optimization Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>{"Critères d'Optimisation"}</CardTitle>
          <CardDescription>{"Calcul multi-critères pour proposer l'itinéraire le plus adapté"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, name: "Temps", desc: "Itinéraire le plus rapide", color: "text-blue-600" },
              { icon: MapPin, name: "Distance", desc: "Itinéraire le plus court", color: "text-green-600" },
              { icon: Navigation, name: "Confort", desc: "Éviter axes secondaires", color: "text-purple-600" },
              { icon: Fuel, name: "Éco-responsable", desc: "Minimiser consommation", color: "text-emerald-600" },
            ].map((criterion) => (
              <div key={criterion.name} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <criterion.icon className={`h-8 w-8 ${criterion.color} mb-2`} />
                <h4 className="font-semibold mb-1">{criterion.name}</h4>
                <p className="text-xs text-muted-foreground">{criterion.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
