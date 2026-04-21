"use client"

import * as React from "react"
import { DashboardChatView } from "@/components/dashboard/v2/chat/chat-view"

export default function DashboardChatPage() {
  return (
    <React.Suspense fallback={null}>
      <DashboardChatView />
    </React.Suspense>
  )
}
