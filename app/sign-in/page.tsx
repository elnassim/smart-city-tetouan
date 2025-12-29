"use client"

import React from "react"
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md p-8">
      <SignIn routing="hash" />
    </div>
  )
}
