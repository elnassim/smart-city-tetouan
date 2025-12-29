import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const backendUrl = process.env.USER_SERVICE_URL || process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081'
  const url = `${backendUrl}/api/users`
  console.log('[api/users] proxying create', { url, body })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      next: { revalidate: 0 },
    })

    let data: any = null
    try { data = await res.json() } catch (_) { }

    console.log('[api/users] backend responded', { status: res.status, ok: res.ok })

    if (process.env.NODE_ENV !== 'production') {
      try { if (data && typeof data === 'object') (data as any)._debug = { servedBy: backendUrl, usedFallback: false } } catch (_) {}
    }

    if (!res.ok && res.status >= 500 && backendUrl.includes('localhost')) {
      try {
        const altUrl = backendUrl.replace(':8081', ':8083')
        console.log('[api/users] attempting fallback to', altUrl)
        const res2 = await fetch(`${altUrl}/api/users`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        })
        let data2: any = null
        try { data2 = await res2.json() } catch (_) { }
        console.log('[api/users] fallback responded', { status: res2.status, ok: res2.ok })
        if (process.env.NODE_ENV !== 'production') {
          try { if (data2 && typeof data2 === 'object') (data2 as any)._debug = { servedBy: altUrl, usedFallback: true } } catch (_) {}
        }
        return NextResponse.json(data2 ?? null, { status: res2.status })
      } catch (e2: any) {
        console.error('[api/users] fallback error', e2)
      }
    }

    if (res.status === 404 && backendUrl.includes('localhost')) {
      try {
        const altUrl = backendUrl.replace(':8081', ':8083')
        console.log('[api/users] primary returned 404 — attempting fallback POST to', altUrl)
        const res3 = await fetch(`${altUrl}/api/users`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        })
        let data3: any = null
        try { data3 = await res3.json() } catch (_) { }
        console.log('[api/users] fallback responded', { status: res3.status, ok: res3.ok })
        if (process.env.NODE_ENV !== 'production') {
          try { if (data3 && typeof data3 === 'object') (data3 as any)._debug = { servedBy: altUrl, usedFallback: true } } catch (_) {}
        }
        return NextResponse.json(data3 ?? null, { status: res3.status })
      } catch (e3: any) {
        console.error('[api/users] fallback POST error', e3)
      }
    }

    return NextResponse.json(data ?? null, { status: res.status })
  } catch (e: any) {
    console.error('[api/users] proxy error', e)

    if (backendUrl.includes('localhost')) {
      try {
        const altUrl = backendUrl.replace(':8081', ':8083')
        console.log('[api/users] attempt fallback POST to', altUrl)
        const resAlt = await fetch(`${altUrl}/api/users`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        })
        let dataAlt: any = null
        try { dataAlt = await resAlt.json() } catch (_) {}
        console.log('[api/users] fallback responded', { status: resAlt.status, ok: resAlt.ok })
        return NextResponse.json(dataAlt ?? null, { status: resAlt.status })
      } catch (e2: any) {
        console.error('[api/users] fallback error', e2)
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: 'proxy failed', debug: { message: e?.message, stack: e?.stack } }, { status: 502 })
    }
    return NextResponse.json({ error: 'proxy failed' }, { status: 502 })
  }
}
