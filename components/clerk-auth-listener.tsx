"use client"

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

export default function ClerkAuthListener() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    const prev = prevRef.current
    if (!prev && userId) {
      if (pathname === '/' || pathname.startsWith('/sign-in')) {
        router.replace('/')
      } else {
        
        router.refresh()
      }
    }

    prevRef.current = userId ?? null
  }, [isLoaded, userId, pathname, router])

  return null
}
