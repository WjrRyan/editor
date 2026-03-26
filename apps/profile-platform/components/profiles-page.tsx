'use client'

import { useMemo, useState } from 'react'
import { getPersonaProfile, type PersonaId } from '@pascal-app/profile-core'
import { X } from 'lucide-react'
import { PageHeading, SignalPill, SurfacePanel, TraitMeter } from '@/components/ui-kit'
import { useDemoStore } from '@/stores/use-demo-store'

export function ProfilesPage() {
  const catalog = useDemoStore((state) => state.catalog)
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(null)

  const activeProfile = useMemo(
    () => (activePersonaId ? getPersonaProfile(activePersonaId) : null),
    [activePersonaId],
  )

  return (
    <div className="space-y-7">
      <PageHeading
        title="Profiles：把单客画像拆开看，确认它为什么成立。"
        description="这个页面专门用来验证平台沉淀下来的画像内容。每个 trait 都保留 confidence、freshness 和 evidence，让运营、算法或 Agent 团队都能理解它。"
      />

      <section className="grid gap-5 xl:grid-cols-3">
        {catalog?.personas.map((persona) => {
          const profile = getPersonaProfile(persona.id)

          return (
            <button
              className="control-room-panel rounded-[30px] border p-6 text-left transition hover:-translate-y-1"
              key={persona.id}
              onClick={() => setActivePersonaId(persona.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                    {persona.travelArchetype}
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                    {persona.displayName}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)]">
                    {persona.headline}
                  </p>
                </div>
                <SignalPill tone="gold">{persona.homeMarket}</SignalPill>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {persona.tags.map((tag) => (
                  <SignalPill key={tag}>{tag}</SignalPill>
                ))}
              </div>

              <div className="mt-6 space-y-3">
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
              </div>
            </button>
          )
        })}
      </section>

      {activeProfile ? (
        <div className="fixed inset-0 z-40 bg-[rgba(16,34,49,0.36)] backdrop-blur-sm">
          <div className="absolute inset-y-0 right-0 w-full max-w-[720px] overflow-y-auto bg-[rgba(247,241,231,0.96)] p-5 shadow-[0_30px_80px_rgba(16,34,49,0.24)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Profile detail
                </p>
                <h2 className="mt-2 font-display text-4xl text-[var(--panel)] tracking-[-0.05em]">
                  {activeProfile.displayName}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-soft)]">
                  {activeProfile.overview}
                </p>
              </div>
              <button
                className="rounded-full border border-[var(--line)] bg-white/74 p-3 text-[var(--panel)]"
                onClick={() => setActivePersonaId(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <SignalPill tone="teal">{activeProfile.identity_summary.traveler_archetype}</SignalPill>
              <SignalPill>{activeProfile.identity_summary.party_signature}</SignalPill>
              <SignalPill tone="gold">{activeProfile.identity_summary.home_market}</SignalPill>
            </div>

            <div className="mt-7 grid gap-5">
              <SurfacePanel className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Identity summary
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(activeProfile.identity_summary).map(([key, value]) => (
                    <div className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4" key={key}>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                        {key.replaceAll('_', ' ')}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                        {Array.isArray(value) ? value.join(' / ') : value}
                      </p>
                    </div>
                  ))}
                </div>
              </SurfacePanel>

              <SurfacePanel className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Core traits
                </p>
                <div className="grid gap-3">
                  {[...activeProfile.travel_preferences, activeProfile.price_sensitivity, activeProfile.value_band]
                    .slice(0, 5)
                    .map((trait) => (
                      <TraitMeter
                        confidence={trait.confidence}
                        key={trait.id}
                        label={trait.label}
                        timestamp={trait.freshnessAt}
                        value={trait.value}
                      />
                    ))}
                </div>
              </SurfacePanel>

              <SurfacePanel className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Evidence chain
                </p>
                <div className="space-y-3">
                  {activeProfile.evidence.slice(0, 6).map((evidence) => (
                    <div
                      className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4"
                      key={evidence.id}
                    >
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
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Recent changes
                </p>
                <div className="space-y-3">
                  {activeProfile.change_log.map((item) => (
                    <div
                      className="rounded-[20px] border border-[var(--line)] bg-white/72 p-4"
                      key={item.id}
                    >
                      <p className="font-medium text-[var(--panel)]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </SurfacePanel>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
