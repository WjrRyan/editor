'use client'

import { useEffect, useEffectEvent } from 'react'
import { useDemoStore } from '@/stores/use-demo-store'

export function DemoPlaybackManager() {
  const currentRun = useDemoStore((state) => state.currentRun)
  const playbackState = useDemoStore((state) => state.playbackState)
  const advanceStage = useDemoStore((state) => state.advanceStage)

  const handleAdvance = useEffectEvent(() => {
    advanceStage()
  })

  useEffect(() => {
    if (!currentRun || playbackState !== 'playing') return

    const runningStage = currentRun.stages.find((stage) => stage.status === 'running')
    if (!runningStage) return

    const timer = window.setTimeout(() => {
      handleAdvance()
    }, runningStage.durationMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [currentRun, playbackState, handleAdvance])

  return null
}
