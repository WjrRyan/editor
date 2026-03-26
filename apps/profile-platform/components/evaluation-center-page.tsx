'use client'

import { getPersonaEvaluation } from '@pascal-app/profile-core'
import { AlertTriangle, ShieldCheck, Target } from 'lucide-react'
import { MetricTile, PageHeading, SignalPill, SurfacePanel } from '@/components/ui-kit'
import { formatPercent } from '@/lib/utils'
import { useDemoStore } from '@/stores/use-demo-store'

export function EvaluationCenterPage() {
  const catalog = useDemoStore((state) => state.catalog)

  return (
    <div className="space-y-7">
      <PageHeading
        title="Evaluation Center：让画像平台不是“看起来聪明”，而是真的可上线。"
        description="这里集中展示 Schema Mapping 覆盖率、trait 准确率、矛盾率和上线门槛。Demo 虽然使用 seed data，但评测界面会完整呈现生产平台应该有的质量治理视角。"
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile label="平均 Overall Score" value="94" delta="healthy" />
        <MetricTile label="平均 Mapping Coverage" value="98%" delta="stable" />
        <MetricTile label="平均 Trait F1" value="91%" delta="+2 pts" />
        <MetricTile label="矛盾率上限" value="<2%" delta="pass" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <SurfacePanel className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[18px] bg-[var(--gold-soft)] p-3 text-[var(--panel)]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                Persona quality board
              </p>
              <h2 className="mt-1 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                逐个 persona 看质量
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {catalog?.evaluationSnapshots.map((snapshot) => {
              const evaluation = getPersonaEvaluation(snapshot.personaId)

              return (
                <div className="rounded-[24px] border border-[var(--line)] bg-white/74 p-5" key={snapshot.personaId}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl text-[var(--panel)] tracking-[-0.04em]">
                        {snapshot.displayName}
                      </p>
                      <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                        Overall {formatPercent(snapshot.overallScore)} · Mapping{' '}
                        {formatPercent(snapshot.mappingCoverage)} · Trait F1{' '}
                        {formatPercent(snapshot.traitF1)}
                      </p>
                    </div>
                    <SignalPill tone={snapshot.status === 'healthy' ? 'teal' : 'gold'}>
                      {snapshot.status}
                    </SignalPill>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {evaluation.alerts.map((alert) => (
                      <div className="rounded-[18px] border border-[var(--line)] bg-white/82 p-4" key={alert}>
                        <p className="text-sm leading-6 text-[var(--foreground)]">{alert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </SurfacePanel>

        <div className="space-y-5">
          <SurfacePanel dark className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-[18px] bg-white/10 p-3 text-[var(--gold)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Release gate</p>
                <h3 className="mt-1 font-display text-3xl tracking-[-0.04em]">上线门槛</h3>
              </div>
            </div>

            <div className="space-y-3">
              {[
                '必填字段覆盖率 >= 95%',
                'Trait F1 >= 0.85',
                '所有 trait 都必须有 evidence',
                '矛盾率 < 2%',
              ].map((item) => (
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4 text-sm text-[var(--panel-muted)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-[18px] bg-[var(--rose-soft)] p-3 text-[var(--panel)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                  Residual risks
                </p>
                <h3 className="mt-1 font-display text-3xl text-[var(--panel)] tracking-[-0.04em]">
                  Demo 里也要讲清楚的风险
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {[
                '价格敏感与高价值并不矛盾，解释文本必须同时保留。',
                '高端客群推荐不能只讲豪华，还要讲私密感与场景。',
                '客服 Agent 读取风险 trait 时，必须保留人可读解释。',
              ].map((item) => (
                <div className="rounded-[18px] border border-[var(--line)] bg-white/74 p-4 text-sm leading-6 text-[var(--foreground-soft)]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>
      </section>
    </div>
  )
}
