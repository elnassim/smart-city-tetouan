"use client"

import React from "react"
import Link from "next/link"

export default function SignInRequiredCatchAll() {
  return (
    <div className="mx-auto max-w-md p-8">
      <h2 className="text-lg font-bold mb-2">Sign-in catch-all helper</h2>
      <p className="mb-4">This path exists to satisfy Clerk's internal catch-all checks.</p>
      <Link href="/sign-in" className="text-blue-600 underline">Go to canonical sign-in</Link>
    </div>
  )
}
