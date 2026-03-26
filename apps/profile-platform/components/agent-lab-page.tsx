'use client'

import { startTransition, useMemo, useState } from 'react'
import { createAgentReplay, getPersonaContextPack } from '@pascal-app/profile-core'
import { Bot, ConciergeBell, Wand2 } from 'lucide-react'
import { Button, JsonBlock, PageHeading, SignalPill, SurfacePanel } from '@/components/ui-kit'
import { queryAgent } from '@/lib/demo/client'
import { useDemoStore } from '@/stores/use-demo-store'

const promptTemplates = {
  recommendation: '请基于当前画像，给这个用户下一次行程推荐策略。',
  support: '请基于当前画像，给客服一个高质量的处理建议。',
} as const

export function AgentLabPage() {
  const selectedPersonaId = useDemoStore((state) => state.selectedPersonaId)
  const selectedUseCase = useDemoStore((state) => state.selectedUseCase)
  const setSelectedUseCase = useDemoStore((state) => state.setSelectedUseCase)
  const latestAgentReply = useDemoStore((state) => state.latestAgentReply)
  const setLatestAgentReply = useDemoStore((state) => state.setLatestAgentReply)
  const currentRun = useDemoStore((state) => state.currentRun)
  const [prompt, setPrompt] = useState<string>(promptTemplates.recommendation)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeRun = currentRun?.personaId === selectedPersonaId ? currentRun : null
  const contextPack = activeRun?.contextPack ?? getPersonaContextPack(selectedPersonaId)
  const fallbackReply = useMemo(
    () => createAgentReplay(selectedPersonaId, selectedUseCase, promptTemplates[selectedUseCase]),
    [selectedPersonaId, selectedUseCase],
  )
  const displayedReply =
    latestAgentReply && latestAgentReply.type === selectedUseCase
      ? latestAgentReply
      : activeRun?.agentReplays.find((item) => item.type === selectedUseCase) ?? fallbackReply

  async function handleSubmit() {
    setIsSubmitting(true)

    try {
      const reply = await queryAgent(selectedPersonaId, selectedUseCase, prompt)
      startTransition(() => {
        setLatestAgentReply(reply)
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-7">
      <PageHeading
        title="Agent Lab：让下游 Agent 真正把这份画像用起来。"
        description="这里演示两类消费方：Recommendation Agent 和 Service Agent。它们不需要自己重放全部行为，而是直接读取 Context Pack，并输出个性化决策。"
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]">
        <SurfacePanel className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {[
              {
                useCase: 'recommendation' as const,
                label: 'Recommendation Agent',
                icon: Wand2,
              },
              {
                useCase: 'support' as const,
                label: 'Service Agent',
                icon: ConciergeBell,
              },
            ].map((item) => {
              const Icon = item.icon
              const active = selectedUseCase === item.useCase

              return (
                <button
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? 'border-transparent bg-[var(--panel)] text-white'
                      : 'border-[var(--line)] bg-white/72 text-[var(--foreground)]'
                  }`}
                  key={item.useCase}
                  onClick={() => {
                    setSelectedUseCase(item.useCase)
                    setPrompt(promptTemplates[item.useCase])
                  }}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-white/76 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
              Prompt
            </p>
            <textarea
              className="mt-4 min-h-[180px] w-full rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-7 outline-none transition focus:border-[var(--line-strong)]"
              onChange={(event) => setPrompt(event.target.value)}
              value={prompt}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs text-[var(--panel)]"
                onClick={() => setPrompt(promptTemplates[selectedUseCase])}
                type="button"
              >
                使用默认模板
              </button>
              <button
                className="rounded-full bg-white px-3 py-1 text-xs text-[var(--foreground-soft)]"
                onClick={() =>
                  setPrompt(
                    selectedUseCase === 'recommendation'
                      ? '如果他下次去东京，你会如何排序推荐房源？'
                      : '如果客户现在来咨询，请给我一段更像真人客服的处理策略。',
                  )
                }
                type="button"
              >
                填入现场演示问题
              </button>
            </div>

            <div className="mt-5">
              <Button disabled={isSubmitting || prompt.trim().length === 0} onClick={handleSubmit}>
                {isSubmitting ? 'Querying…' : 'Run Agent Query'}
              </Button>
            </div>
          </div>

          <SurfacePanel dark className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/10">
                <Bot className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Agent output</p>
                <h2 className="mt-1 font-display text-3xl tracking-[-0.04em]">{displayedReply.title}</h2>
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
              <p className="text-sm leading-7 text-white/82">{displayedReply.response}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Citations</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {displayedReply.citations.map((citation) => (
                    <SignalPill key={citation} tone="gold">
                      {citation}
                    </SignalPill>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Action items</p>
                <div className="mt-3 space-y-2">
                  {displayedReply.actionItems.map((item) => (
                    <p className="text-sm leading-6 text-[var(--panel-muted)]" key={item}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </SurfacePanel>
        </SurfacePanel>

        <div className="space-y-5">
          <SurfacePanel className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Active Context Pack
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  Ready for agent consumption
                </h3>
              </div>
              <SignalPill tone="teal">{contextPack.allowed_use_scope.length} scopes</SignalPill>
            </div>

            <div className="space-y-3">
              {contextPack.stable_preferences.map((item) => (
                <div className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4" key={item}>
                  <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel dark>
            <JsonBlock compact data={contextPack} title="Context Pack JSON" />
          </SurfacePanel>
        </div>
      </section>
    </div>
  )
}
