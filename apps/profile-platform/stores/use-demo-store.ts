'use client'

import type {
  AgentReplay,
  AgentUseCase,
  DemoCatalog,
  PersonaId,
  PipelineRun,
  PipelineStageId,
} from '@pascal-app/profile-core'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { finalStageStatus } from '@/lib/utils'

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed'

type DemoStore = {
  hasHydrated: boolean
  catalog: DemoCatalog | null
  selectedPersonaId: PersonaId
  currentRun: PipelineRun | null
  playbackState: PlaybackState
  selectedStageId: PipelineStageId | null
  selectedUseCase: AgentUseCase
  latestAgentReply: AgentReplay | null
  setHydrated: (value: boolean) => void
  setCatalog: (catalog: DemoCatalog) => void
  setSelectedPersona: (personaId: PersonaId) => void
  startRun: (run: PipelineRun) => void
  pausePlayback: () => void
  resumePlayback: () => void
  advanceStage: () => void
  skipToEnd: () => void
  setSelectedStage: (stageId: PipelineStageId) => void
  setSelectedUseCase: (useCase: AgentUseCase) => void
  setLatestAgentReply: (reply: AgentReplay | null) => void
}

function prepareRun(run: PipelineRun): PipelineRun {
  return {
    ...run,
    stages: run.stages.map((stage, index) => ({
      ...stage,
      status: index === 0 ? 'running' : 'pending',
    })),
  }
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      catalog: null,
      selectedPersonaId: 'business_road_warrior',
      currentRun: null,
      playbackState: 'idle',
      selectedStageId: null,
      selectedUseCase: 'recommendation',
      latestAgentReply: null,
      setHydrated: (value) => set({ hasHydrated: value }),
      setCatalog: (catalog) => set({ catalog }),
      setSelectedPersona: (personaId) =>
        set({
          selectedPersonaId: personaId,
          latestAgentReply: null,
        }),
      startRun: (run) => {
        const prepared = prepareRun(run)
        set({
          currentRun: prepared,
          playbackState: 'playing',
          selectedStageId: prepared.stages[0]?.id ?? null,
          latestAgentReply: null,
        })
      },
      pausePlayback: () => set({ playbackState: 'paused' }),
      resumePlayback: () => {
        if (get().currentRun) {
          set({ playbackState: 'playing' })
        }
      },
      advanceStage: () => {
        const state = get()
        if (!state.currentRun) return

        const stages = state.currentRun.stages.map((stage) => ({ ...stage }))
        const currentIndex = stages.findIndex((stage) => stage.status === 'running')

        if (currentIndex === -1) return
        const currentStage = stages[currentIndex]
        if (!currentStage) return

        stages[currentIndex] = {
          ...currentStage,
          status: finalStageStatus(currentStage),
        }

        const nextStage = stages[currentIndex + 1]
        if (nextStage) {
          stages[currentIndex + 1] = {
            ...nextStage,
            status: 'running',
          }

          set({
            currentRun: { ...state.currentRun, stages },
            selectedStageId: nextStage.id,
            playbackState: 'playing',
          })

          return
        }

        set({
          currentRun: { ...state.currentRun, stages },
          selectedStageId: stages.at(-1)?.id ?? state.selectedStageId,
          playbackState: 'completed',
          latestAgentReply: state.currentRun.agentReplays[0] ?? null,
        })
      },
      skipToEnd: () => {
        const currentRun = get().currentRun
        if (!currentRun) return

        const stages = currentRun.stages.map((stage) => ({
          ...stage,
          status: finalStageStatus(stage),
        }))

        set({
          currentRun: { ...currentRun, stages },
          playbackState: 'completed',
          selectedStageId: stages.at(-1)?.id ?? null,
          latestAgentReply: currentRun.agentReplays[0] ?? null,
        })
      },
      setSelectedStage: (stageId) => set({ selectedStageId: stageId }),
      setSelectedUseCase: (useCase) => set({ selectedUseCase: useCase }),
      setLatestAgentReply: (reply) => set({ latestAgentReply: reply }),
    }),
    {
      name: 'profile-platform-demo',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedPersonaId: state.selectedPersonaId,
        currentRun: state.currentRun,
        playbackState: state.playbackState,
        selectedStageId: state.selectedStageId,
        selectedUseCase: state.selectedUseCase,
        latestAgentReply: state.latestAgentReply,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
