"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, MapPin, Radio, Settings, TrendingUp, Navigation, Wrench } from "lucide-react"
import SupervisionDashboard from "@/components/supervision-dashboard"
import DetectionAnalysis from "@/components/detection-analysis"
import AdaptiveRegulation from "@/components/adaptive-regulation"
import CitizenInformation from "@/components/citizen-information"
import PhysicalIntervention from "@/components/physical-intervention"
import RouteManagement from "@/components/route-management"
import IoTMaintenance from "@/components/iot-maintenance"
import StrategicPiloting from "@/components/strategic-piloting"
import { useRouter } from 'next/navigation'
import { UserButton, SignInButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("supervision")
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSwitch() {
    try { if (signOut) await signOut() } catch (e) { console.warn('switch signOut failed', e) }
    router.push('/sign-in')
  }

  useEffect(() => {
    async function fetchMe() {
      const res = await fetch('/api/me', { credentials: 'include' })
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/sign-in')
          return
        }
        setUser({ error: `User service unavailable (status ${res.status})` })
        return
      }
      const data = await res.json()
      const roles = data.roles || []
      if (!roles.includes('ADMIN')) {
        router.push('/sign-in')
        return
      }
      setUser(data)
    }
    fetchMe()
  }, [router])

  if (!user) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if ((user as any).error) return <div className="container mx-auto px-4 py-8">Error: {(user as any).error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Radio className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  {"Tétouan Smart Heritage City"}
                </h1>
                <p className="text-sm text-muted-foreground">{"Système de Gestion Intelligente du Trafic - Admin"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400"
              >
                <Activity className="h-3 w-3 mr-1" />
                {"Système Opérationnel"}
              </Badge>
             
             
              <div className="ml-2 flex items-center gap-2">
                <SignedIn>
                  <UserButton />
                  <button className="px-3 py-1 border rounded" onClick={handleSwitch}>Sign out</button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-3 py-1 border rounded">Sign in</button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 rounded-xl p-2 shadow-lg border">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
              <TabsTrigger value="supervision" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">{"Supervision"}</span>
              </TabsTrigger>
              <TabsTrigger value="detection" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">{"Détection"}</span>
              </TabsTrigger>
              <TabsTrigger value="regulation" className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span className="hidden sm:inline">{"Régulation"}</span>
              </TabsTrigger>
              <TabsTrigger value="information" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{"Information"}</span>
              </TabsTrigger>
              <TabsTrigger value="intervention" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">{"Intervention"}</span>
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                <span className="hidden sm:inline">{"Itinéraires"}</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">{"Maintenance"}</span>
              </TabsTrigger>
              <TabsTrigger value="piloting" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">{"Pilotage"}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="supervision" className="space-y-4">
            <SupervisionDashboard />
          </TabsContent>

          <TabsContent value="detection" className="space-y-4">
            <DetectionAnalysis />
          </TabsContent>

          <TabsContent value="regulation" className="space-y-4">
            <AdaptiveRegulation />
          </TabsContent>

          <TabsContent value="information" className="space-y-4">
            <CitizenInformation />
          </TabsContent>

          <TabsContent value="intervention" className="space-y-4">
            <PhysicalIntervention />
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <RouteManagement />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <IoTMaintenance />
          </TabsContent>

          <TabsContent value="piloting" className="space-y-4">
            <StrategicPiloting />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

