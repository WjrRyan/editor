'use client'

import Link from 'next/link'
import { getPersonaProfile, getPersonaSummary } from '@pascal-app/profile-core'
import { Activity, ArrowRight, CheckCircle2, Orbit, ShieldCheck, Waves } from 'lucide-react'
import { PageHeading, MetricTile, MiniInfoList, SignalPill, SurfacePanel } from '@/components/ui-kit'
import { formatPercent } from '@/lib/utils'
import { useDemoStore } from '@/stores/use-demo-store'

const sourceCards = [
  {
    title: '授权 OTA Feed',
    detail: '模拟 Booking / Trip 风格授权事件流，原始 payload 保留在 bronze 层。',
    icon: Orbit,
  },
  {
    title: 'Profile Composer',
    detail: '将行为、评论和客服文本融合成结构化、可解释的画像 trait。',
    icon: Waves,
  },
  {
    title: 'Quality Gate',
    detail: '为每次画像生成计算覆盖率、trait F1 与矛盾率，决定是否可发布。',
    icon: ShieldCheck,
  },
]

export function OverviewPage() {
  const catalog = useDemoStore((state) => state.catalog)
  const selectedPersonaId = useDemoStore((state) => state.selectedPersonaId)
  const currentRun = useDemoStore((state) => state.currentRun)
  const playbackState = useDemoStore((state) => state.playbackState)

  const selectedSummary = getPersonaSummary(selectedPersonaId)
  const selectedProfile = getPersonaProfile(selectedPersonaId)

  return (
    <div className="space-y-7">
      <PageHeading
        title="从原始 OTA 行为，到能被 Agent 直接调用的用户画像。"
        description="这个 Demo 把平台的核心价值一次讲清楚：授权数据如何进入平台、如何被 Agent 工作流加工成可解释画像，以及推荐 / 服务系统如何消费它。"
        actions={
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--panel)] px-5 text-sm text-white shadow-[0_14px_28px_rgba(16,34,49,0.16)] transition hover:-translate-y-0.5"
            href="/journey"
          >
            打开 Journey
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {catalog?.overviewMetrics.map((metric) => (
          <MetricTile delta={metric.delta} key={metric.id} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <SurfacePanel className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                Platform story
              </p>
              <h2 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                画像平台的第一职责，是给下游 Agent 提供可信上下文
              </h2>
            </div>
            <SignalPill tone="teal">Agent-first profile infra</SignalPill>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sourceCards.map((item) => {
              const Icon = item.icon
              return (
                <div
                  className="rounded-[24px] border border-[var(--line)] bg-white/70 p-5"
                  key={item.title}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[var(--gold-soft)] text-[var(--panel)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 font-medium text-[var(--panel)] text-lg">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{item.detail}</p>
                </div>
              )
            })}
          </div>

          <MiniInfoList
            items={[
              {
                label: '平台输出',
                value: 'Unified Profile + Agent Context Pack，而不是一段黑盒摘要',
              },
              {
                label: '下游用途',
                value: 'Recommendation、Service Assist、Campaign Targeting',
              },
              {
                label: '质量要求',
                value: 'trait 必须携带 confidence、freshness 和 evidence 引用',
              },
              {
                label: '演示方式',
                value: 'Journey 通过确定性回放展示完整 Agent 流程和界面样式',
              },
            ]}
          />
        </SurfacePanel>

        <SurfacePanel dark className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Latest snapshot</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-0.04em]">{selectedSummary.displayName}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--panel-muted)]">{selectedSummary.headline}</p>
            </div>
            <SignalPill tone="gold">{selectedSummary.travelArchetype}</SignalPill>
          </div>

          <div className="grid gap-3">
            {selectedSummary.highlightMetrics.map((metric) => (
              <div
                className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/6 px-4 py-3"
                key={metric.label}
              >
                <p className="text-sm text-[var(--panel-muted)]">{metric.label}</p>
                <p className="font-display text-2xl tracking-[-0.04em]">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <Activity className="h-4 w-4 text-[var(--teal)]" />
              当前运行状态
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--panel-muted)]">
              {currentRun?.personaId === selectedPersonaId
                ? `Journey 当前处于 ${playbackState} 状态，质量分 ${formatPercent(
                    currentRun.evaluation.overallScore,
                  )}。`
                : '还没有为当前 persona 运行新的 pipeline，建议到 Journey 启动完整回放。'}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <CheckCircle2 className="h-4 w-4 text-[var(--gold)]" />
              当前画像摘要
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--panel-muted)]">{selectedProfile.overview}</p>
          </div>
        </SurfacePanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <SurfacePanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                推荐的演示路径
              </p>
              <h3 className="mt-2 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                先看单客 Journey，再看 Agent Lab
              </h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: '1. Journey',
                detail: '看原始数据如何穿过 8 个 Agent / system stage，生成画像与 context pack。',
              },
              {
                title: '2. Profiles',
                detail: '展开单客画像，验证 trait、evidence 和最近变化是否可信。',
              },
              {
                title: '3. Agent Lab',
                detail: '让推荐 Agent 与服务 Agent 真正调用画像，看到结果如何变化。',
              },
            ].map((item) => (
              <div className="rounded-[22px] border border-[var(--line)] bg-white/76 p-4" key={item.title}>
                <p className="font-medium text-[var(--panel)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </SurfacePanel>

        <SurfacePanel className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            Current focus
          </p>
          <h3 className="font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
            {selectedSummary.displayName}
          </h3>
          <p className="text-sm leading-6 text-[var(--foreground-soft)]">{selectedSummary.spotlight}</p>
          <div className="flex flex-wrap gap-2">
            {selectedSummary.tags.map((tag) => (
              <SignalPill key={tag}>{tag}</SignalPill>
            ))}
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm text-[var(--panel)]"
            href="/profiles"
          >
            进入 Profiles 查看详情
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SurfacePanel>
      </section>
    </div>
  )
}
