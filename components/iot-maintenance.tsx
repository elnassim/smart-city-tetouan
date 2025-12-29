"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Activity, AlertTriangle, CheckCircle2, Camera, Radio, Wifi } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function IoTMaintenance() {
  const equipment = [
    {
      type: "Caméras Intelligentes",
      total: 156,
      operational: 152,
      warning: 3,
      critical: 1,
      icon: Camera,
      lastMaintenance: "2 jours",
    },
    {
      type: "Capteurs de Trafic",
      total: 89,
      operational: 87,
      warning: 2,
      critical: 0,
      icon: Activity,
      lastMaintenance: "5 jours",
    },
    {
      type: "Feux Adaptatifs",
      total: 64,
      operational: 64,
      warning: 0,
      critical: 0,
      icon: Radio,
      lastMaintenance: "1 jour",
    },
    {
      type: "Équipements Réseau",
      total: 42,
      operational: 40,
      warning: 1,
      critical: 1,
      icon: Wifi,
      lastMaintenance: "3 jours",
    },
  ]

  const maintenanceTickets = [
    {
      id: "MAINT-2024-089",
      equipment: "Caméra CAM-045",
      location: "Avenue Mohammed V - Intersection 3",
      issue: "Qualité image dégradée",
      priority: "Critique",
      type: "Corrective",
      status: "En cours",
      assignedTo: "Équipe Tech-2",
      eta: "1h",
    },
    {
      id: "MAINT-2024-090",
      equipment: "Routeur NET-012",
      location: "Zone Nord - Relais Principal",
      issue: "Latence élevée",
      priority: "Haute",
      type: "Corrective",
      status: "Planifié",
      assignedTo: "Équipe Tech-1",
      eta: "3h",
    },
    {
      id: "MAINT-2024-088",
      equipment: "Capteurs SENS-023 à SENS-028",
      location: "Route de Martil - Secteur Est",
      issue: "Nettoyage préventif",
      priority: "Moyenne",
      type: "Préventive",
      status: "Terminé",
      assignedTo: "Équipe Tech-3",
      eta: "-",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            {"Processus 7 : MAINTENANCE IoT"}
          </CardTitle>
          <CardDescription className="text-amber-50">
            {"Garantir la disponibilité et la fiabilité de l'infrastructure technologique"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {"Disponibilité Infrastructure"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{"98.2%"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 98%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Temps Résolution Panne"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"< 4h"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Moyenne actuelle: 3.2h"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Ratio Maintenance"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{"70/30"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Préventive/Corrective"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Tickets Ouverts"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {maintenanceTickets.filter((t) => t.status !== "Terminé").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{"Interventions actives"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-600" />
            {"État Santé des Équipements IoT"}
          </CardTitle>
          <CardDescription>{"Surveillance continue 24/7 de tous les équipements déployés"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {equipment.map((item) => (
              <div key={item.type} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-8 w-8 text-amber-600" />
                    <div>
                      <h4 className="font-semibold">{item.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {"Dernière maintenance: "} {item.lastMaintenance}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.total} {"unités"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{"État général"}</span>
                    <span className="font-medium">
                      {((item.operational / item.total) * 100).toFixed(1)}
                      {"% opérationnel"}
                    </span>
                  </div>
                  <Progress value={(item.operational / item.total) * 100} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{"Opérationnel"}</p>
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="font-semibold text-green-600">{item.operational}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{"Alerte"}</p>
                    <div className="flex items-center justify-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <p className="font-semibold text-orange-600">{item.warning}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{"Critique"}</p>
                    <div className="flex items-center justify-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="font-semibold text-red-600">{item.critical}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-600" />
              {"Tickets de Maintenance"}
            </span>
            <Button size="sm">
              <Wrench className="h-4 w-4 mr-2" />
              {"Nouveau Ticket"}
            </Button>
          </CardTitle>
          <CardDescription>{"Gestion préventive, prédictive et corrective des équipements"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge
                      variant={
                        ticket.type === "Préventive"
                          ? "secondary"
                          : ticket.type === "Prédictive"
                            ? "default"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {ticket.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold">{ticket.equipment}</h4>
                  <p className="text-sm text-muted-foreground">{ticket.location}</p>
                </div>
                <Badge
                  variant={
                    ticket.status === "Terminé" ? "secondary" : ticket.status === "En cours" ? "default" : "outline"
                  }
                  className={ticket.status === "Terminé" ? "bg-green-100 text-green-800" : ""}
                >
                  {ticket.status === "Terminé" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {ticket.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Problème"}</p>
                  <p className="font-medium">{ticket.issue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Priorité"}</p>
                  <Badge
                    variant={
                      ticket.priority === "Critique"
                        ? "destructive"
                        : ticket.priority === "Haute"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"Équipe"}</p>
                  <p className="font-medium">{ticket.assignedTo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{"ETA"}</p>
                  <p className="font-medium">{ticket.eta}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
