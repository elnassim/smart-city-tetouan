"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin, User, CheckCircle2, AlertTriangle } from "lucide-react"

export default function PhysicalIntervention() {
  const interventions = [
    {
      id: "INT-2024-0156",
      location: "Quartier M'hannech - Place Al Jala",
      type: "Accident avec blessés",
      priority: "Critique",
      status: "En cours",
      assignedTo: "Patrouille Alpha-3",
      eta: "3 min",
      duration: "12 min",
      coordinated: ["SAMU", "Pompiers"],
    },
    {
      id: "INT-2024-0157",
      location: "Route de Martil - Km 4",
      type: "Véhicule en panne",
      priority: "Haute",
      status: "En route",
      assignedTo: "Patrouille Bravo-1",
      eta: "7 min",
      duration: "5 min",
      coordinated: ["Dépanneuse"],
    },
    {
      id: "INT-2024-0155",
      location: "Avenue Mohammed V - Centre",
      type: "Régulation manuelle",
      priority: "Moyenne",
      status: "Terminé",
      assignedTo: "Patrouille Charlie-2",
      eta: "-",
      duration: "18 min",
      coordinated: [],
    },
  ]

  const patrols = [
    { id: "Alpha-3", status: "En intervention", location: "Place Al Jala", agents: 2 },
    { id: "Bravo-1", status: "En route", location: "Route de Martil", agents: 2 },
    { id: "Charlie-2", status: "Disponible", location: "Avenue Hassan II", agents: 2 },
    { id: "Delta-4", status: "Disponible", location: "Boulevard Nord", agents: 2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Car className="h-6 w-6" />
            {"Processus 5 : INTERVENTION PHYSIQUE"}
          </CardTitle>
          <CardDescription className="text-red-50">
            {"Gestion humaine des situations complexes nécessitant une présence sur le terrain"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Temps Arrivée Moyen"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"< 8min"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: < 8 minutes"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Taux Résolution"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"86%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Au premier passage"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Durée Moyenne"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"22min"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: < 25 minutes"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Patrouilles Actives"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {patrols.filter((p) => p.status !== "Disponible").length}/{patrols.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{"Équipes déployées"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Interventions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {"Interventions en Cours"}
            </span>
            <Button size="sm" variant="destructive">
              <Car className="h-4 w-4 mr-2" />
              {"Nouvelle Intervention"}
            </Button>
          </CardTitle>
          <CardDescription>{"Dispatch automatique et coordination en temps réel"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{intervention.location}</h4>
                    <Badge variant="outline" className="text-xs">
                      {intervention.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{intervention.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      intervention.priority === "Critique"
                        ? "destructive"
                        : intervention.priority === "Haute"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {intervention.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      intervention.status === "En cours"
                        ? "bg-orange-50 border-orange-300"
                        : intervention.status === "En route"
                          ? "bg-blue-50 border-blue-300"
                          : "bg-green-50 border-green-300"
                    }
                  >
                    {intervention.status === "Terminé" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {intervention.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-3 w-3" />
                    {"Patrouille"}
                  </p>
                  <p className="font-semibold text-sm">{intervention.assignedTo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    {"ETA"}
                  </p>
                  <p className="font-semibold text-sm">{intervention.eta}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    {"Durée"}
                  </p>
                  <p className="font-semibold text-sm">{intervention.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Coordination"}</p>
                  <div className="flex flex-wrap gap-1">
                    {intervention.coordinated.length > 0 ? (
                      intervention.coordinated.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">{"Aucune"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Patrol Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-red-600" />
            {"État des Patrouilles"}
          </CardTitle>
          <CardDescription>{"Localisation en temps réel et disponibilité des équipes terrain"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {patrols.map((patrol) => (
              <div key={patrol.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{patrol.id}</h4>
                  <Badge
                    variant={patrol.status === "Disponible" ? "secondary" : "default"}
                    className={patrol.status === "Disponible" ? "bg-green-100 text-green-800" : ""}
                  >
                    {patrol.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" />
                  {patrol.location}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {patrol.agents} {"agents"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
