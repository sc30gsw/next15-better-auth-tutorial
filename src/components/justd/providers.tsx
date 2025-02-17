'use client'

import { useRouter } from 'next/navigation'
import { RouterProvider } from 'react-aria-components'
import { ThemeProvider } from '~/components/justd/theme-provider'
import { Toast } from '~/components/justd/ui'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider enableSystem attribute="class">
        <Toast />
        {children}
      </ThemeProvider>
    </RouterProvider>
  )
}
