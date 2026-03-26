'use client'

import { startTransition, useMemo, useState } from 'react'
import {
  getJourneyStageGraph,
  getPersonaContextPack,
  getPersonaProfile,
  getPersonaRawEvents,
  type PipelineStageResult,
} from '@pascal-app/profile-core'
import { Pause, Play, RotateCcw, SkipForward, Sparkles } from 'lucide-react'
import {
  Button,
  JsonBlock,
  PageHeading,
  SignalPill,
  StageCard,
  StatusBadge,
  SurfacePanel,
  TraitMeter,
} from '@/components/ui-kit'
import { triggerDemoRun } from '@/lib/demo/client'
import { formatDateTime, formatStageDuration } from '@/lib/utils'
import { useDemoStore } from '@/stores/use-demo-store'

function createPlaceholderStages(): PipelineStageResult[] {
  return getJourneyStageGraph().map((stage, index) => ({
    id: stage.id,
    title: stage.title,
    agentLabel: stage.agentLabel,
    description: '等待运行 Demo pipeline',
    status: 'pending',
    durationMs: 1000 + index * 100,
    score: 0,
    highlights: ['Run Demo Pipeline 后会填充真实样本'],
    explanation: '该阶段将在流程运行后显示输入样本、输出 JSON 和评分。',
    inputSample: { stage: stage.id, ready: false },
    outputSample: { stage: stage.id, ready: false },
  }))
}

export function JourneyPage() {
  const selectedPersonaId = useDemoStore((state) => state.selectedPersonaId)
  const currentRun = useDemoStore((state) => state.currentRun)
  const playbackState = useDemoStore((state) => state.playbackState)
  const selectedStageId = useDemoStore((state) => state.selectedStageId)
  const startRun = useDemoStore((state) => state.startRun)
  const pausePlayback = useDemoStore((state) => state.pausePlayback)
  const resumePlayback = useDemoStore((state) => state.resumePlayback)
  const skipToEnd = useDemoStore((state) => state.skipToEnd)
  const setSelectedStage = useDemoStore((state) => state.setSelectedStage)
  const setLatestAgentReply = useDemoStore((state) => state.setLatestAgentReply)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeRun = currentRun?.personaId === selectedPersonaId ? currentRun : null
  const fallbackProfile = useMemo(() => getPersonaProfile(selectedPersonaId), [selectedPersonaId])
  const fallbackContext = useMemo(() => getPersonaContextPack(selectedPersonaId), [selectedPersonaId])
  const fallbackRawEvents = useMemo(() => getPersonaRawEvents(selectedPersonaId), [selectedPersonaId])
  const stages = activeRun?.stages ?? createPlaceholderStages()
  const selectedStage =
    stages.find((stage) => stage.id === selectedStageId) ??
    stages.find((stage) => stage.status === 'running') ??
    stages[0]!
  const completedStages = stages.filter(
    (stage) => stage.status === 'passed' || stage.status === 'warning',
  ).length
  const profile = activeRun?.profile ?? fallbackProfile
  const contextPack = activeRun?.contextPack ?? fallbackContext
  const rawEvents = activeRun?.rawEvents ?? fallbackRawEvents
  const agentOutputs =
    activeRun && playbackState === 'completed' ? activeRun.agentReplays : []

  async function handleRun() {
    setIsSubmitting(true)

    try {
      const run = await triggerDemoRun(selectedPersonaId)
      startTransition(() => {
        startRun(run)
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-7">
      <PageHeading
        title="单客 Journey：看一份用户画像如何被 Agent 流程沉淀出来。"
        description="点击 Run Demo Pipeline 后，这个页面会按 stage 回放：原始行为进入平台、被标准化、抽取偏好、生成画像、通过 QA，并最终发布给推荐 Agent 与服务 Agent。"
        actions={
          <>
            <Button disabled={isSubmitting} onClick={handleRun}>
              {isSubmitting ? 'Running…' : 'Run Demo Pipeline'}
            </Button>
            <Button
              disabled={!activeRun || playbackState === 'idle' || playbackState === 'completed'}
              onClick={() => {
                if (playbackState === 'playing') {
                  pausePlayback()
                } else {
                  resumePlayback()
                }
              }}
              variant="secondary"
            >
              {playbackState === 'playing' ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>
            <Button disabled={!activeRun} onClick={handleRun} variant="secondary">
              <RotateCcw className="mr-2 h-4 w-4" />
              Replay
            </Button>
            <Button disabled={!activeRun} onClick={skipToEnd} variant="ghost">
              <SkipForward className="mr-2 h-4 w-4" />
              Skip to End
            </Button>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.92fr)]">
        <div className="space-y-5">
          <SurfacePanel className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Pipeline rail
                </p>
                <h2 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  {completedStages}/{stages.length} stages completed
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedStage.status} />
                <SignalPill tone="gold">
                  {selectedStage.score > 0 ? `Score ${selectedStage.score}` : 'Ready'}
                </SignalPill>
              </div>
            </div>

            <div className="fine-scrollbar flex gap-3 overflow-x-auto pb-1">
              {stages.map((stage) => (
                <StageCard
                  active={selectedStage.id === stage.id}
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  stage={stage}
                />
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel dark className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                  Stage detail
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-[-0.04em]">{selectedStage.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--panel-muted)]">
                  {selectedStage.explanation}
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 font-mono text-[11px] text-[var(--panel-muted)]">
                {formatStageDuration(selectedStage.durationMs)}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <JsonBlock data={selectedStage.inputSample} title="Input sample" />
              <JsonBlock data={selectedStage.outputSample} title="Output sample" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {selectedStage.highlights.map((highlight) => (
                <div
                  className="rounded-[20px] border border-white/10 bg-white/6 p-4 text-sm leading-6 text-[var(--panel-muted)]"
                  key={highlight}
                >
                  {highlight}
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>

        <div className="space-y-5">
          <SurfacePanel className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Profile snapshot
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  {profile.displayName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{profile.overview}</p>
              </div>
              <SignalPill tone="teal">{profile.identity_summary.traveler_archetype}</SignalPill>
            </div>

            <div className="grid gap-3">
              <TraitMeter
                confidence={profile.travel_preferences[0]?.confidence ?? 0}
                label={profile.travel_preferences[0]?.label ?? 'Travel preference'}
                timestamp={profile.travel_preferences[0]?.freshnessAt ?? profile.lastUpdatedAt}
                value={profile.travel_preferences[0]?.value ?? '-'}
              />
              <TraitMeter
                confidence={profile.price_sensitivity.confidence}
                label={profile.price_sensitivity.label}
                timestamp={profile.price_sensitivity.freshnessAt}
                value={profile.price_sensitivity.value}
              />
              <TraitMeter
                confidence={profile.value_band.confidence}
                label={profile.value_band.label}
                timestamp={profile.value_band.freshnessAt}
                value={profile.value_band.value}
              />
              <TraitMeter
                confidence={profile.recent_intents[0]?.confidence ?? 0}
                label={profile.recent_intents[0]?.label ?? 'Recent intent'}
                timestamp={profile.recent_intents[0]?.freshnessAt ?? profile.lastUpdatedAt}
                value={profile.recent_intents[0]?.value ?? '-'}
              />
            </div>
          </SurfacePanel>

          <SurfacePanel className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Context Pack
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  Downstream ready
                </h3>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div className="space-y-3">
              {contextPack.stable_preferences.map((item) => (
                <div
                  className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4 text-sm leading-6 text-[var(--foreground)]"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
              Evidence strip
            </p>
            <div className="space-y-3">
              {profile.evidence.slice(0, 3).map((evidence) => (
                <div className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4" key={evidence.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--panel)]">{evidence.label}</p>
                    <SignalPill>{Math.round(evidence.weight * 100)} weight</SignalPill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
                    {evidence.snippet}
                  </p>
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                Downstream consumers
              </p>
              <SignalPill tone="gold">{playbackState === 'completed' ? 'Live' : 'After finish'}</SignalPill>
            </div>

            {agentOutputs.length > 0 ? (
              <div className="space-y-3">
                {agentOutputs.map((item) => (
                  <button
                    className="w-full rounded-[20px] border border-[var(--line)] bg-white/74 p-4 text-left transition hover:bg-white"
                    key={item.id}
                    onClick={() => setLatestAgentReply(item)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-[var(--panel)]">{item.title}</p>
                      <SignalPill tone="teal">{item.type}</SignalPill>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
                      {item.response}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-dashed border-[var(--line)] bg-white/60 p-4 text-sm leading-6 text-[var(--foreground-soft)]">
                流程跑完后，这里会出现推荐 Agent 和服务 Agent 的输出结果。
              </div>
            )}
          </SurfacePanel>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <SurfacePanel className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            Raw evidence feed
          </p>
          <div className="space-y-3">
            {rawEvents.slice(0, 4).map((event) => (
              <div className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4" key={event.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SignalPill>{event.type}</SignalPill>
                    <p className="font-medium text-[var(--panel)]">{event.sourceLabel}</p>
                  </div>
                  <p className="text-xs text-[var(--foreground-soft)]">{formatDateTime(event.timestamp)}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)]">{event.summary}</p>
              </div>
            ))}
          </div>
        </SurfacePanel>

        <SurfacePanel className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            Current focus
          </p>
          <h3 className="font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
            {profile.identity_summary.party_signature}
          </h3>
          <div className="space-y-3">
            <div className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                booking pattern
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                {profile.identity_summary.booking_window_pattern}
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                preferred channels
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                {profile.identity_summary.preferred_channels.join(' / ')}
              </p>
            </div>
          </div>
        </SurfacePanel>
      </section>
    </div>
  )
}
