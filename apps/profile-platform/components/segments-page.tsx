'use client'

import { useMemo, useState } from 'react'
import { PageHeading, SignalPill, SurfacePanel } from '@/components/ui-kit'
import { useDemoStore } from '@/stores/use-demo-store'

export function SegmentsPage() {
  const catalog = useDemoStore((state) => state.catalog)
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(
    catalog?.segmentDefinitions[0]?.id ?? null,
  )

  const activeSegment = useMemo(
    () =>
      catalog?.segmentDefinitions.find((segment) => segment.id === activeSegmentId) ??
      catalog?.segmentDefinitions[0] ??
      null,
    [activeSegmentId, catalog],
  )

  const previewPersonas = useMemo(() => {
    if (!catalog || !activeSegment) return []

    if (activeSegment.id === 'seg_business_priority') {
      return catalog.personas.filter((persona) => persona.id === 'business_road_warrior')
    }

    if (activeSegment.id === 'seg_family_coupon') {
      return catalog.personas.filter((persona) => persona.id === 'family_value_hunter')
    }

    return catalog.personas.filter((persona) => persona.id === 'luxury_escape_curator')
  }, [activeSegment, catalog])

  return (
    <div className="space-y-7">
      <PageHeading
        title="Segments：把画像沉淀成可运营、可调用的人群包。"
        description="这版 Demo 不做复杂编辑器，而是把完整的人群包界面做出来，展示画像如何被转成推荐系统或 Agent 可直接消费的 segment。"
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <SurfacePanel className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            Segment library
          </p>
          <div className="grid gap-4">
            {catalog?.segmentDefinitions.map((segment) => {
              const active = segment.id === activeSegment?.id

              return (
                <button
                  className={`rounded-[24px] border p-5 text-left transition ${
                    active
                      ? 'border-transparent bg-[var(--panel)] text-white shadow-[0_20px_40px_rgba(16,34,49,0.18)]'
                      : 'border-[var(--line)] bg-white/76 text-[var(--foreground)] hover:bg-white'
                  }`}
                  key={segment.id}
                  onClick={() => setActiveSegmentId(segment.id)}
                  type="button"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-2xl tracking-[-0.04em]">{segment.name}</p>
                    <SignalPill tone={active ? 'gold' : 'neutral'}>
                      {segment.estimatedReach} audience
                    </SignalPill>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${active ? 'text-white/70' : 'text-[var(--foreground-soft)]'}`}>
                    {segment.description}
                  </p>
                </button>
              )
            })}
          </div>
        </SurfacePanel>

        <div className="space-y-5">
          <SurfacePanel className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
              Segment detail
            </p>
            {activeSegment ? (
              <>
                <h2 className="font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  {activeSegment.name}
                </h2>
                <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                  {activeSegment.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeSegment.criteria.map((criteria) => (
                    <SignalPill key={criteria} tone="teal">
                      {criteria}
                    </SignalPill>
                  ))}
                </div>
              </>
            ) : null}
          </SurfacePanel>

          <SurfacePanel dark className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Preview audience</p>
            <div className="space-y-3">
              {previewPersonas.map((persona) => (
                <div className="rounded-[20px] border border-white/10 bg-white/6 p-4" key={persona.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{persona.displayName}</p>
                    <SignalPill tone="gold">{persona.travelArchetype}</SignalPill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">{persona.headline}</p>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>
      </section>
    </div>
  )
}
