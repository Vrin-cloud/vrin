'use client'

import { EnterpriseAuthProvider } from '@/hooks/use-enterprise-auth'

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EnterpriseAuthProvider>
      {children}
    </EnterpriseAuthProvider>
  )
}