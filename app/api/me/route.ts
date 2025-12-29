import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const authState = await auth()


  const cookieHeader = req.headers.get('cookie') || null
  if (!authState || !authState.userId) {

    console.log('[api/me] Unauthenticated request', { cookie: !!cookieHeader, cookieHeaderExists: !!cookieHeader, authState })

    if (process.env.NODE_ENV !== 'production') {

      return NextResponse.json({ error: 'Unauthenticated', debug: { cookie: cookieHeader ? 'present' : 'missing', authState } }, { status: 401 })
    }

    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const clerkId = authState.userId
  const backendUrl = process.env.USER_SERVICE_URL || process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081'


  console.log('[api/me] contacting user-service', { clerkId, backendUrl })

  try {
    const url = `${backendUrl}/api/users/${encodeURIComponent(clerkId)}`
    console.log('[api/me] fetching', url)

    const res = await fetch(url, { next: { revalidate: 0 } })

    console.log('[api/me] user-service responded', { status: res.status, ok: res.ok })

    if (res.status === 404) {
      console.log('[api/me] user not found, attempting to create user on-demand')
      try {
        const createRes = await fetch(`${backendUrl}/api/users`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ clerkId }),
          next: { revalidate: 0 },
        })
        console.log('[api/me] create user response', { status: createRes.status, ok: createRes.ok })
        let created: any = null
        try { created = await createRes.json() } catch (_) { }
        if (createRes.ok) {
          const resp = created ?? { clerkId }
          if (process.env.NODE_ENV !== 'production') resp._debug = { servedBy: backendUrl, usedFallback: false }
          return NextResponse.json(resp, { status: createRes.status })
        }
        if (createRes.status === 404 && backendUrl.includes('localhost')) {
          try {
            const altUrl = backendUrl.replace(':8081', ':8083')
            console.log('[api/me] primary create returned 404 — attempting fallback create to', altUrl)
            const createRes2 = await fetch(`${altUrl}/api/users`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ clerkId }),
              next: { revalidate: 0 },
            })
            console.log('[api/me] fallback create user response', { status: createRes2.status, ok: createRes2.ok })
            let created2: any = null
            try { created2 = await createRes2.json() } catch (_) { }
            if (createRes2.ok) {
              const resp2 = created2 ?? { clerkId }
              if (process.env.NODE_ENV !== 'production') resp2._debug = { servedBy: altUrl, usedFallback: true }
              return NextResponse.json(resp2, { status: createRes2.status })
            }
          } catch (createErr2: any) {
            console.error('[api/me] fallback create failed', createErr2)
          }
        }
      } catch (createErr: any) {
        console.error('[api/me] failed to create user on-demand', createErr)
      }
    }

    let data: any = null
    try { data = await res.json() } catch (parseErr) {
      console.warn('[api/me] user-service returned non-json response')
    }


    console.log('[api/me] user-service data', data)

    const resp = data ?? { message: 'no body' }
    if (process.env.NODE_ENV !== 'production') {
      try { (resp as any)._debug = { servedBy: backendUrl, usedFallback: false } } catch (_) {}
    }

    return NextResponse.json(resp, { status: res.status })
  } catch (e: any) {
    console.error('[api/me] failed to contact user-service', e)

    const tried: string[] = []
    const isConnRefused = (e?.message || '').includes('ECONNREFUSED') || (e?.cause?.code === 'ECONNREFUSED')
    if (isConnRefused && backendUrl.includes('localhost')) {
      const altUrl = backendUrl.replace(':8081', ':8083')
      tried.push(`${altUrl}/api/users/${encodeURIComponent(clerkId)}`)
      try {
        console.log('[api/me] attempting fallback to', altUrl)
        const res2 = await fetch(`${altUrl}/api/users/${encodeURIComponent(clerkId)}`, { next: { revalidate: 0 } })
        console.log('[api/me] fallback responded', { status: res2.status, ok: res2.ok })
        let data2: any = null
        try { data2 = await res2.json() } catch (_) { }

        if (res2.status === 404) {
          console.log('[api/me] fallback 404 — attempting to create user on fallback host')
          try {
            const createRes2 = await fetch(`${altUrl}/api/users`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ clerkId }),
              next: { revalidate: 0 },
            })
            console.log('[api/me] fallback create user response', { status: createRes2.status, ok: createRes2.ok })
            let created2: any = null
            try { created2 = await createRes2.json() } catch (_) { }
            if (createRes2.ok) {
              const resp2 = created2 ?? { clerkId }
              if (process.env.NODE_ENV !== 'production') resp2._debug = { servedBy: altUrl, usedFallback: true }
              return NextResponse.json(resp2, { status: createRes2.status })
            }
          } catch (createErr2: any) {
            console.error('[api/me] failed to create user on fallback host', createErr2)
          }
        }

        const respFallback = data2 ?? { message: 'no body' }
        if (process.env.NODE_ENV !== 'production') {
          try { respFallback._debug = { servedBy: altUrl, usedFallback: true } } catch (_) {}
        }

        return NextResponse.json(respFallback, { status: res2.status })
      } catch (e2: any) {
        console.error('[api/me] fallback also failed', e2)
        tried.push(`${backendUrl}/api/users/${encodeURIComponent(clerkId)}`)
        if (process.env.NODE_ENV !== 'production') {
          return NextResponse.json({ error: 'Failed to contact user-service', debug: { message: e?.message, stack: e?.stack, tried } }, { status: 502 })
        }
        return NextResponse.json({ error: 'Failed to contact user-service' }, { status: 502 })
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: 'Failed to contact user-service', debug: { message: e?.message, stack: e?.stack, tried } }, { status: 502 })
    }
    return NextResponse.json({ error: 'Failed to contact user-service' }, { status: 502 })
  }
}
