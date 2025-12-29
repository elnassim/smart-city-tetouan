"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Activity, Camera, Radio, Satellite, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SupervisionDashboard() {
  const [incidents, setIncidents] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchIncidents() {
      try {
        const res = await fetch('/api/incidents', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) {
          console.debug('fetch incidents failed status', res.status)
          return
        }
        const wrapper = await res.json()
        const data = wrapper?.data || wrapper 
        if (mounted) {
          setIncidents(data)
          console.debug('fetched incidents', (data || []).length)
        }
      } catch (e) {
        console.warn('Failed to fetch incidents', e)
      }
    }
    fetchIncidents()
    const iv = setInterval(fetchIncidents, 5000)
    return () => { mounted = false; clearInterval(iv) }
  }, [])

  async function changeStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/incidents/${id}/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) {
        console.warn('changeStatus failed', res.status)
        return
      }
      // refresh
      const r = await fetch('/api/incidents', { credentials: 'include', cache: 'no-store' })
      if (r.ok) {
        const wrapper = await r.json()
        setIncidents(wrapper?.data || wrapper)
      }
    } catch (e) {
      console.error('changeStatus failed', e)
    }
  }

  async function sendResponse(id: string, message: string) {
    try {
      const res = await fetch(`/api/incidents/${id}/responses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message })
      })
      if (!res.ok) {
        console.warn('sendResponse failed', res.status)
        return
      }
      // refresh
      const r = await fetch('/api/incidents', { credentials: 'include', cache: 'no-store' })
      if (r.ok) {
        const wrapper = await r.json()
        setIncidents(wrapper?.data || wrapper)
      }
    } catch (e) {
      console.error('sendResponse failed', e)
    }
  }

  const totalIncidents = incidents.length
  const countsByStatus = incidents.reduce((acc: Record<string, number>, it: any) => {
    const s = it.status || 'unknown'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const trafficData = [
    { location: "Avenue Mohammed V", status: "fluide", speed: 45, density: 35, color: "green" },
    { location: "Route de Martil", status: "ralenti", speed: 25, density: 72, color: "orange" },
    { location: "Boulevard Hassan II", status: "fluide", speed: 50, density: 28, color: "green" },
    { location: "Quartier M'hannech", status: "congestionné", speed: 12, density: 95, color: "red" },
  ]

  const iotDevices = [
    { type: "Caméras Intelligentes", count: 156, online: 152, icon: Camera },
    { type: "Capteurs de Flux", count: 89, online: 87, icon: Activity },
    { type: "Feux Adaptatifs", count: 64, online: 64, icon: Radio },
    { type: "GPS Véhicules", count: 234, online: 229, icon: Satellite },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            {"Processus 1 : SUPERVISION"}
          </CardTitle>
          <CardDescription className="text-blue-50">
            {"Collecte continue et surveillance en temps réel de l'état du trafic urbain"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Signalements summary (live) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Activity className="h-8 w-8 text-blue-600" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {totalIncidents} {"signalement(s)"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{"Signalements (dernier)"}</h3>
            <p className="text-sm text-muted-foreground mb-2">{"Voir détails ci-dessous"}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-yellow-50 text-yellow-700">{(countsByStatus['submitted'] || 0)} soumises</Badge>
              <Badge className="bg-cyan-50 text-cyan-700">{(countsByStatus['in_progress'] || 0)} en cours</Badge>
              <Badge className="bg-green-50 text-green-700">{(countsByStatus['resolved'] || 0)} résolues</Badge>
            </div>
            <div className="mt-3">
              <h4 className="font-medium">Dernières signalements</h4>
              <ul className="mt-2 space-y-2">
                {incidents.slice(0,2).map((it:any) => (
                  <li key={it.id} className="text-sm text-muted-foreground">
                    <strong className="block">{it.title || it.claimNumber || '—'}</strong>
                    <span className="text-xs">{it.claimNumber} • {it.status || 'unknown'}</span>
                    <div className="mt-2 flex gap-2">
                      {it.status !== 'in_progress' && (
                        <button className="px-2 py-1 text-xs bg-yellow-50 rounded" onClick={async () => { if (confirm('Mark as in_progress?')) { await changeStatus(it.id, 'in_progress'); } }}>Mark in_progress</button>
                      )}
                      {it.status !== 'resolved' && (
                        <button className="px-2 py-1 text-xs bg-green-50 rounded" onClick={async () => { if (confirm('Mark as resolved?')) { await changeStatus(it.id, 'resolved'); } }}>Mark resolved</button>
                      )}
                      <button className="px-2 py-1 text-xs bg-blue-50 rounded" onClick={async () => { const msg = prompt('Send response to citizen:'); if (msg) await sendResponse(it.id, msg); }}>Send response</button>
                    </div>
                  </li>
                ))}
                {incidents.length === 0 && <li className="text-sm text-muted-foreground">Aucun signalement</li>}
              </ul>
              {incidents.length > 2 && (
                <div className="mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 text-sm bg-blue-50 rounded">Voir tous</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Tous les signalements</DialogTitle>
                      <DialogDescription>Liste complète des signalements</DialogDescription>
                      <div className="mt-4 max-h-64 overflow-auto space-y-3">
                        {incidents.map((it:any) => (
                          <div key={it.id} className="border rounded p-2">
                            <strong className="block">{it.title || it.claimNumber || '—'}</strong>
                            <span className="text-xs text-muted-foreground">{it.claimNumber} • {it.status || 'unknown'}</span>
                            <div className="mt-2 flex gap-2">
                              {it.status !== 'in_progress' && (
                                <button className="px-2 py-1 text-xs bg-yellow-50 rounded" onClick={async () => { if (confirm('Mark as in_progress?')) { await changeStatus(it.id, 'in_progress'); } }}>Mark in_progress</button>
                              )}
                              {it.status !== 'resolved' && (
                                <button className="px-2 py-1 text-xs bg-green-50 rounded" onClick={async () => { if (confirm('Mark as resolved?')) { await changeStatus(it.id, 'resolved'); } }}>Mark resolved</button>
                              )}
                              <button className="px-2 py-1 text-xs bg-blue-50 rounded" onClick={async () => { const msg = prompt('Send response to citizen:'); if (msg) await sendResponse(it.id, msg); }}>Send response</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogClose asChild>
                        <button className="mt-4 px-3 py-1 bg-muted rounded">Fermer</button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* IoT Infrastructure Status */}
        {iotDevices.map((device) => (
          <Card key={device.type} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <device.icon className="h-8 w-8 text-blue-600" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {((device.online / device.count) * 100).toFixed(1)}
                  {"% actifs"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{device.type}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {device.online} / {device.count} {"en ligne"}
              </p>
              <Progress value={(device.online / device.count) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-Time Traffic Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-600" />
            {"État du Trafic en Temps Réel"}
          </CardTitle>
          <CardDescription>
            {"Supervision continue 24/7 - Latence < 2 secondes - Couverture 100% des axes principaux"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficData.map((location) => (
              <div
                key={location.location}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      location.color === "green"
                        ? "bg-green-500"
                        : location.color === "orange"
                          ? "bg-orange-500"
                          : "bg-red-500"
                    } animate-pulse`}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{location.location}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{location.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{"Vitesse"}</p>
                    <p className="font-semibold flex items-center gap-1">
                      {location.speed} {"km/h"}
                      {location.speed > 40 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{"Densité"}</p>
                    <p className="font-semibold">
                      {location.density}
                      {"%"}
                    </p>
                  </div>
                  {location.density > 80 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {"Alerte"}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Taux Disponibilité Capteurs"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">98.7%</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: > 98%"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Latence Transmission"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{"1.2s"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Objectif: < 2 secondes"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Couverture Réseau"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <p className="text-xs text-muted-foreground mt-1">{"Axes principaux couverts"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
