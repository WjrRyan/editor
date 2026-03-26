'use client'

import { startTransition, useEffect } from 'react'
import { fetchDemoCatalog } from '@/lib/demo/client'
import { useDemoStore } from '@/stores/use-demo-store'

export function DemoBootstrap() {
  const catalog = useDemoStore((state) => state.catalog)
  const setCatalog = useDemoStore((state) => state.setCatalog)
  const setHydrated = useDemoStore((state) => state.setHydrated)

  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  useEffect(() => {
    if (catalog) return

    let isCancelled = false

    fetchDemoCatalog()
      .then((payload) => {
        if (isCancelled) return

        startTransition(() => {
          setCatalog(payload)
        })
      })
      .catch((error) => {
        console.error('Failed to load demo catalog', error)
      })

    return () => {
      isCancelled = true
    }
  }, [catalog, setCatalog])

  return null
}
