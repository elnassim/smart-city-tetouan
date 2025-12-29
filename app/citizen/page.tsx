"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useAuth } from '@clerk/nextjs'
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  Send,
  CheckCircle,
  Car,
  FileText,
} from "lucide-react"

export default function CitizenTrafficPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  // Role guard: ensure user is authenticated and has CITOYEN role
  useEffect(() => {
    async function checkRole() {
      const res = await fetch('/api/me', { credentials: 'include' })
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/sign-in'
          return
        }
        alert(`User service unavailable (status ${res.status}). Please start the backend and retry.`)
        return
      }
      const data = await res.json()
      const roles = data.roles || []
      if (!roles.includes('CITOYEN')) {
        window.location.href = '/sign-in'
        return
      }
    }
    checkRole()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current).setView([35.5889, -5.3626], 13)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        const incidents = [
          { lat: 35.5889, lng: -5.3626, type: "high", label: "Avenue Mohammed V - Congestion majeure" },
          { lat: 35.5795, lng: -5.3688, type: "medium", label: "Place Hassan II - Travaux routiers" },
          { lat: 35.592, lng: -5.355, type: "low", label: "Rue de Fès - Circulation fluide" },
        ]

        incidents.forEach((incident) => {
          const color = incident.type === "high" ? "#ef4444" : incident.type === "medium" ? "#eab308" : "#22c55e"

          const icon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          L.marker([incident.lat, incident.lng], { icon }).addTo(map).bindPopup(`<b>${incident.label}</b>`)
        })

        mapInstanceRef.current = map
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const trafficAlerts = [
    {
      id: 1,
      location: "Avenue Mohammed V",
      severity: "high",
      type: "Congestion majeure",
      time: "Il y a 5 min",
      delay: "+15 min",
    },
    {
      id: 2,
      location: "Place Hassan II",
      severity: "medium",
      type: "Travaux routiers",
      time: "Il y a 12 min",
      delay: "+8 min",
    },
    {
      id: 3,
      location: "Rue de Fès",
      severity: "low",
      type: "Circulation fluide",
      time: "Il y a 2 min",
      delay: "Normal",
    },
  ]

  const alternativeRoutes = [
    {
      id: 1,
      from: "Centre-ville",
      to: "Zone industrielle",
      duration: "12 min",
      distance: "5.2 km",
      traffic: "Fluide",
      savings: "7 min économisés",
    },
    {
      id: 2,
      from: "Médina",
      to: "Université",
      duration: "18 min",
      distance: "8.1 km",
      traffic: "Modéré",
      savings: "4 min économisés",
    },
  ]

  const [incidentType, setIncidentType] = useState('')
  const [incidentLocation, setIncidentLocation] = useState('')
  const [incidentDescription, setIncidentDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const { signOut, getToken } = useAuth()

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let token: string | null = null
      try {
        token = await getToken()
      } catch (tErr) {
        console.warn('Could not obtain token from Clerk', tErr)
      }

      const headers: Record<string, string> = { 'content-type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`


      const payloadToSend = {
        type: incidentType,
        serviceType: incidentType,
        location: incidentLocation,
        address: incidentLocation,
        description: incidentDescription,
        title: incidentDescription ? incidentDescription.slice(0, 80) : 'Signalement',
        claim: {
          serviceType: incidentType,
          title: incidentDescription ? incidentDescription.slice(0, 80) : 'Signalement',
          description: incidentDescription,
          priority: 'normal',
          location: { address: incidentLocation, latitude: null, longitude: null },
          attachments: [],
          extraData: {},
        },
      }

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers,
        body: JSON.stringify(payloadToSend),
      })
      const data = await res.json()
      if (res.ok) {
        setReportSubmitted(true)
        setLastResult(data)
        setTimeout(() => setReportSubmitted(false), 3000)
        setIncidentType('')
        setIncidentLocation('')
        setIncidentDescription('')
      } else {
        alert('Failed to submit report: ' + JSON.stringify(data))
        setLastResult(data)
      }
    } catch (err) {
      console.error('Submit failed', err)
      alert('Submit failed: ' + (err as any).message)
      setLastResult({ error: (err as any).message })
    } finally {
      setSubmitting(false)
    }
  }

  const router = useRouter()

  async function handleSwitch() {
    try {
      if (signOut) await signOut()
    } catch (e) {
      console.warn('switch signOut failed', e)
    }
    router.push('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-balance text-foreground">{"Tétouan Trafic"}</h1>
              </div>
              <p className="text-muted-foreground text-pretty leading-relaxed max-w-2xl">
                {
                  "Consultez l'état du trafic en temps réel, recevez des alertes et trouvez les meilleurs itinéraires dans la ville de Tétouan"
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button size="lg" className="w-full lg:w-auto">
                <MapPin className="h-4 w-4 mr-2" />
                {"Ma position"}
              </Button>

              <div className="flex items-center gap-2">
                <SignedIn>
                  <UserButton />

                  <button className="px-3 py-1 border rounded" onClick={handleSwitch}>Se déconnecter</button>

                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-3 py-1 border rounded">Se connecter</button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {"Rechercher un itinéraire"}
            </CardTitle>
            <CardDescription>{"Entrez votre destination pour obtenir les meilleures options"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Où allez-vous ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button size="lg" className="md:w-auto">
                <Navigation className="h-4 w-4 mr-2" />
                {"Calculer l'itinéraire"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {"Carte du trafic en temps réel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <div ref={mapRef} className="w-full h-full" style={{ minHeight: "500px" }} />
              <div className="absolute top-4 right-4 flex gap-2 z-[1000]">
                <Badge className="bg-background/90 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  {"Congestion"}
                </Badge>
                <Badge className="bg-background/90 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                  {"Modéré"}
                </Badge>
                <Badge className="bg-background/90 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  {"Fluide"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              {"Alertes trafic"}
            </h2>
            <div className="space-y-3">
              {trafficAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="border-l-4"
                  style={{
                    borderLeftColor:
                      alert.severity === "high"
                        ? "rgb(239, 68, 68)"
                        : alert.severity === "medium"
                          ? "rgb(234, 179, 8)"
                          : "rgb(34, 197, 94)",
                  }}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{alert.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.type}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {alert.delay}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Alternative Routes */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
              <Navigation className="h-6 w-6 text-primary" />
              {"Itinéraires alternatifs"}
            </h2>
            <div className="space-y-3">
              {alternativeRoutes.map((route) => (
                <Card key={route.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{"De:"}</span>
                            <span className="font-medium text-foreground">{route.from}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{"À:"}</span>
                            <span className="font-medium text-foreground">{route.to}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {route.savings}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {route.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          {route.distance}
                        </span>
                        <Badge variant="secondary">{route.traffic}</Badge>
                      </div>
                      <Button className="w-full" size="sm">
                        {"Utiliser cet itinéraire"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Report Incident Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {"Signaler un incident"}
            </CardTitle>
            <CardDescription>{"Aidez votre communauté en signalant les problèmes de circulation"}</CardDescription>
          </CardHeader>
          <CardContent>
            {reportSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-lg font-semibold">{"Merci pour votre signalement !"}</p>
                <p className="text-sm text-muted-foreground text-center">{"Votre contribution aide à améliorer la circulation pour tous"}</p>
               
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">{"Type d'incident"}</Label>
                    <select
                      id="incident-type"
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">{"Sélectionner..."}</option>
                      <option value="congestion">{"Embouteillage"}</option>
                      <option value="accident">{"Accident"}</option>
                      <option value="roadwork">{"Travaux"}</option>
                      <option value="other">{"Autre"}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{"Localisation"}</Label>
                    <Input id="location" value={incidentLocation} onChange={(e) => setIncidentLocation((e.target as HTMLInputElement).value)} placeholder="Ex: Avenue Mohammed V" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{"Description"}</Label>
                  <Textarea id="description" value={incidentDescription} onChange={(e) => setIncidentDescription((e.target as HTMLTextAreaElement).value)} placeholder="Décrivez brièvement la situation..." rows={3} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Envoi...' : 'Envoyer le signalement'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{"Vitesse moyenne"}</p>
                  <p className="text-3xl font-bold">{"42 km/h"}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{"Incidents actifs"}</p>
                  <p className="text-3xl font-bold">{"8"}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{"Signalements aujourd'hui"}</p>
                  <p className="text-3xl font-bold">{"127"}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">{"Tétouan Smart Heritage City"}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {"Une ville intelligente au service de ses citoyens"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{"Liens utiles"}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {"À propos"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {"Contact"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {"FAQ"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{"Contact"}</h3>
              <p className="text-sm text-muted-foreground">
                {"Email: info@tetouan-smart.ma"}
                <br />
                {"Tél: +212 539 XXX XXX"}
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            {"© 2025 Tétouan Smart Heritage City. Tous droits réservés."}
          </div>
        </div>
      </footer>
    </div>
  )
}
