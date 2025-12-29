import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server' 

export async function GET(req: Request) {
  const authState = await auth()
  if (!authState || !authState.userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const backendUrl = process.env.TRAFFIC_SERVICE_URL || process.env.NEXT_PUBLIC_TRAFFIC_SERVICE_URL || 'http://localhost:8080'
  const url = `${backendUrl}/api/incidents`
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
      console.debug('[api/incidents][GET] proxy ->', url, { outgoingHeaders })
    }

    const res = await fetch(url, { method: 'GET', headers: outgoingHeaders, next: { revalidate: 0 } })

    const data = await res.json()
    return NextResponse.json({ ok: res.ok, status: res.status, data }, { status: res.status })
  } catch (e: any) {
    console.error('[api/incidents][GET] proxy error', e)
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: 'proxy failed', debug: { message: e?.message } }, { status: 502 })
    }
    return NextResponse.json({ error: 'proxy failed' }, { status: 502 })
  }
}

export async function POST(req: Request) {
  const authState = await auth()
  if (!authState || !authState.userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const body = await req.json()
  const serviceType = body.type || body.serviceType || 'other'
  const address = body.location || body.address || ''
  const description = body.description || ''
  const title = body.title || (description ? description.slice(0, 80) : 'Signalement')
  const clerkId = authState.userId

  let userInfo: any = { id: clerkId }
  try {
    const client = await clerkClient()
    const u = await client.users.getUser(clerkId)
    userInfo.email = u.primaryEmailAddress?.emailAddress || (u.emailAddresses && u.emailAddresses[0]?.emailAddress) || null
    userInfo.firstName = u.firstName || null
    userInfo.lastName = u.lastName || null
    const nameParts = [userInfo.firstName, userInfo.lastName].filter(Boolean)
    userInfo.name = nameParts.length ? nameParts.join(' ') : null
    userInfo.phone = (u.phoneNumbers && u.phoneNumbers[0]?.phoneNumber) || null
  } catch (e: any) {
    console.debug('[api/incidents] clerk user fetch failed', e?.message || e)
  }

  const messageId = crypto.randomUUID()
  const claimId = crypto.randomUUID()
  const now = new Date().toISOString()

  const clientClaim = body.claim || {}
  const claim = {
    serviceType: clientClaim.serviceType || serviceType,
    title: clientClaim.title || title,
    description: clientClaim.description || description,
    priority: clientClaim.priority || body.priority || 'normal',
    location: clientClaim.location || { address, latitude: body.latitude || (clientClaim.location && clientClaim.location.latitude) || null, longitude: body.longitude || (clientClaim.location && clientClaim.location.longitude) || null },
    attachments: clientClaim.attachments || body.attachments || [],
    extraData: clientClaim.extraData || body.extraData || {},
  }

  const payload = {
    messageId,
    messageType: 'CLAIM_CREATED',
    timestamp: now,
    version: '1.0',
    claimId,
    claimNumber: `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`,
    correlationId: messageId,
    user: userInfo,
    claim,
  }

  const backendUrl = process.env.TRAFFIC_SERVICE_URL || process.env.NEXT_PUBLIC_TRAFFIC_SERVICE_URL || 'http://localhost:8080'
  const url = `${backendUrl}/api/incidents`
  try {
    const incomingAuth = req.headers.get('authorization')
    const outgoingHeaders: Record<string,string> = { 'content-type': 'application/json' }
    if (incomingAuth) outgoingHeaders['Authorization'] = incomingAuth

    if (process.env.NODE_ENV !== 'production') {
      console.debug('[api/incidents] proxy ->', url, { payload, outgoingHeaders })
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: outgoingHeaders,
      body: JSON.stringify(payload),
      next: { revalidate: 0 },
    })

    let data: any = null
    try { data = await res.json() } catch (_) {}

    return NextResponse.json({ ok: res.ok, status: res.status, data })
  } catch (e: any) {
    console.error('[api/incidents] proxy error', e)
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: 'proxy failed', debug: { message: e?.message } }, { status: 502 })
    }
    return NextResponse.json({ error: 'proxy failed' }, { status: 502 })
  }
}
