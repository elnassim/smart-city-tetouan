"use client"

import React from "react"
import { SignUp } from "@clerk/nextjs"

export default function SignUpCatchAllPage() {
  return (
    <div className="mx-auto max-w-md p-8">
      <SignUp routing="path" />
    </div>
  )
}
