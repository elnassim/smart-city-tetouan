import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const authState = await auth()
  if (!authState || !authState.userId) {
    return redirect('/sign-in')
  }

  const clerkId = authState.userId
  const backendUrl = process.env.USER_SERVICE_URL || process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081'

  const fetchWithTimeout = async (url: string, opts: RequestInit = {}, timeoutMs = 5000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...opts, cache: 'no-store', signal: controller.signal as any })
      clearTimeout(id)
      return res
    } catch (e) {
      clearTimeout(id)
      throw e
    }
  }

  try {
    const url = `${backendUrl}/api/users/${encodeURIComponent(clerkId)}`
    console.log('[root] fetching user', { clerkId, url })
    const res = await fetchWithTimeout(url)

    if (res.ok) {
      const user = await res.json()
      const roles = user?.roles || []
      if (roles.includes('ADMIN')) return redirect('/admin')
      return redirect('/citizen')
    }

    if (!res.ok && backendUrl.includes('localhost')) {
      const altUrl = backendUrl.includes(':8081') ? backendUrl.replace(':8081', ':8083') : null
      if (!altUrl) {
        console.log('[root] primary returned non-ok status but no fallback configured for', backendUrl, { status: res.status, statusText: res.statusText })
      } else {
        console.log('[root] primary returned non-ok — trying fallback', altUrl, { status: res.status })
        try {
          const res2 = await fetchWithTimeout(`${altUrl}/api/users/${encodeURIComponent(clerkId)}`)
          if (res2.ok) {
            const user2 = await res2.json()
            const roles2 = user2?.roles || []
            if (roles2.includes('ADMIN')) return redirect('/admin')
            return redirect('/citizen')
          }

          if (res2.status === 404) {
            console.log('[root] fallback 404 — attempting create on fallback host')
            let created: any = null
            try {
              const createRes = await fetchWithTimeout(`${altUrl}/api/users`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ clerkId }),
              })
              if (createRes.ok) {
                created = await createRes.json()
              } else {
                const txt = await createRes.text().catch(() => null)
                console.error('[root] fallback create returned non-ok', { status: createRes.status, statusText: createRes.statusText, body: txt?.slice(0, 1000) })
              }
            } catch (e) {
              if (e && (e as any).digest?.toString?.().startsWith?.('NEXT_REDIRECT') || (e as any).name === 'NEXT_REDIRECT') throw e
              console.error('[root] fallback create failed', e)
            }

            if (created) {
              const roles3 = created?.roles || []
              if (roles3.includes('ADMIN')) return redirect('/admin')
              return redirect('/citizen')
            }
          } else {
            const txt2 = await res2.text().catch(() => null)
            console.error('[root] fallback returned non-ok', { status: res2.status, statusText: res2.statusText, body: txt2?.slice(0, 1000) })
          }
        } catch (e) {
          if (e && (e as any).digest?.toString?.().startsWith?.('NEXT_REDIRECT') || (e as any).name === 'NEXT_REDIRECT') throw e
          console.error('[root] fallback fetch failed', e)
        }
      }
    }

    const bodySnippet = await res.text().catch(() => null)
    console.error('[root] user-service returned non-ok status', { status: res.status, statusText: res.statusText, body: bodySnippet?.slice(0, 1000) })
    
  } catch (e: any) {
    
    if (e && (e.name === 'NEXT_REDIRECT' || (e as any).digest?.toString?.().startsWith?.('NEXT_REDIRECT'))) throw e
    console.error('[root] failed to contact user-service', e?.message ?? e)
    
  }
}

