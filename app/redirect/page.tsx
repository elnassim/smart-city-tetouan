'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectPage() {
  const router = useRouter()
  const [msg, setMsg] = useState('Checking role...')
  const [debug, setDebug] = useState<any>(null)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        const text = await res.text()
        let json: any = null
        try { json = JSON.parse(text) } catch(_) { json = { text } }

        if (!res.ok) {
          setDebug(json)

          if (res.status === 401) {
            setMsg('Not authenticated (see debug)')
            setTimeout(() => router.push('/sign-in'), 800)
            return
          }

          setMsg(`User service unavailable (status ${res.status}). Please start the backend user-service and retry.`)
          return
        }

        const data = json
        setDebug(data)
        const roles = data.roles || []
        if (roles.includes('ADMIN')) {
          setTimeout(() => router.push('/admin'), 200)
          return
        }

        setMsg('No ADMIN role — inspect below or elevate (dev)')
        return
      } catch (e) {
        setMsg('Error')
        router.push('/sign-in')
      }
    }
    check()
  }, [router])

  async function elevateToAdmin() {
    if (!debug?.clerkId) return
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ clerkId: debug.clerkId, publicMetadata: JSON.stringify({ role: 'ADMIN' }) }),
      })
      if (!res.ok) {
        alert('Failed to set role: ' + res.status)
        return
      }
      const refreshed = await fetch('/api/me', { credentials: 'include' })
      const rjson = await refreshed.json()
      if ((rjson.roles || []).includes('ADMIN')) {
        router.push('/admin')
      } else {
        alert('Role change applied but not reflected; check user-service logs')
      }
    } catch (e) {
      alert('Error: ' + String(e))
    }
  }

  return <div>
    <div>{msg}</div>
    {debug && (
      <div className="mt-4 p-2 bg-gray-100 text-sm">
        <pre>{JSON.stringify(debug, null, 2)}</pre>
        <div className="mt-2 flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => router.push('/citizen')}>Proceed as CITOYEN</button>
          <button className="px-3 py-1 border rounded" onClick={elevateToAdmin}>Set ADMIN role (dev)</button>
        </div>
      </div>
    )}
  </div>
}
