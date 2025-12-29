import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request, { params }: { params: Promise<{ id?: string }> }) {
  const authState = await auth()
  if (!authState || !authState.userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const body = await req.json()
  const resolvedParams = await params as { id?: string }
  const id = resolvedParams?.id
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  const backendUrl = process.env.TRAFFIC_SERVICE_URL || process.env.NEXT_PUBLIC_TRAFFIC_SERVICE_URL || 'http://localhost:8080'
  const url = `${backendUrl}/api/incidents/${id}/responses`

  try {
    const incomingAuth = req.headers.get('authorization')
    const outgoingHeaders: Record<string,string> = { 'content-type': 'application/json' }

    if (incomingAuth) {
      outgoingHeaders['Authorization'] = incomingAuth
    } else if (authState && authState.userId) {
      const base64Url = (s: string) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      const header = base64Url(JSON.stringify({ alg: 'none' }))
      const payload = base64Url(JSON.stringify({ sub: authState.userId }))
      const fakeToken = `${header}.${payload}.`
      outgoingHeaders['Authorization'] = `Bearer ${fakeToken}`
    }

    if (process.env.NODE_ENV !== 'production') {
      console.debug('[api/incidents][POST response] proxy ->', url, { body, outgoingHeaders })
    }

    const res = await fetch(url, { method: 'POST', headers: outgoingHeaders, body: JSON.stringify(body) })
    const data = await res.json().catch(() => null)
    return NextResponse.json({ ok: res.ok, status: res.status, data }, { status: res.status })
  } catch (e: any) {
    console.error('[api/incidents][POST response] proxy error', e)
    return NextResponse.json({ error: 'proxy failed' }, { status: 502 })
  }
}
