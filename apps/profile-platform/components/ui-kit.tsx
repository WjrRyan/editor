'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { PipelineStageResult, StageRuntimeStatus } from '@pascal-app/profile-core'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn, formatConfidence, formatDateTime, formatJson, formatPercent, stageStatusLabel, stageTone } from '@/lib/utils'

export function SurfacePanel({
  className,
  dark = false,
  children,
}: {
  className?: string
  dark?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-[28px] border p-5',
        dark ? 'control-room-dark' : 'control-room-panel',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full border transition-all duration-200',
        size === 'md' ? 'h-11 px-5 text-sm' : 'h-9 px-4 text-xs',
        variant === 'primary' &&
          'border-transparent bg-[var(--panel)] text-white shadow-[0_12px_30px_rgba(16,34,49,0.18)] hover:-translate-y-0.5 hover:bg-[var(--panel-2)]',
        variant === 'secondary' &&
          'border-[var(--line-strong)] bg-white/70 text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-white',
        variant === 'ghost' &&
          'border-transparent bg-transparent text-[var(--foreground-soft)] hover:bg-white/60 hover:text-[var(--foreground)]',
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium text-[11px] uppercase tracking-[0.24em]',
        tone === 'accent'
          ? 'border-[rgba(79,197,182,0.34)] bg-[var(--teal-soft)] text-[var(--panel)]'
          : 'border-[var(--line)] bg-white/70 text-[var(--foreground-soft)]',
      )}
    >
      {tone === 'accent' ? <Sparkles className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  )
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <Eyebrow tone="accent">Travel Intelligence Control Room</Eyebrow>
        <div className="space-y-2">
          <h1 className="max-w-4xl font-display text-4xl text-[var(--panel)] tracking-[-0.04em] md:text-[3.2rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-[15px] leading-7 text-[var(--foreground-soft)]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}

export function MetricTile({
  label,
  value,
  delta,
}: {
  label: string
  value: string
  delta: string
}) {
  return (
    <SurfacePanel className="metric-glow min-h-[148px]">
      <p className="text-[12px] uppercase tracking-[0.22em] text-[var(--foreground-soft)]">{label}</p>
      <div className="mt-6 flex items-end justify-between gap-3">
        <p className="font-display text-4xl text-[var(--panel)] tracking-[-0.05em]">{value}</p>
        <span className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-[11px] font-medium text-[var(--panel)]">
          {delta}
        </span>
      </div>
    </SurfacePanel>
  )
}

export function StatusBadge({
  status,
  className,
}: {
  status: StageRuntimeStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-medium text-[11px] uppercase tracking-[0.18em]',
        stageTone(status),
        className,
      )}
    >
      {stageStatusLabel(status)}
    </span>
  )
}

export function JsonBlock({
  title,
  data,
  compact = false,
}: {
  title: string
  data: unknown
  compact?: boolean
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[rgba(8,19,28,0.48)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-medium text-[var(--panel-text)] text-sm">{title}</p>
        <span className="rounded-full bg-white/8 px-2 py-1 font-mono text-[10px] text-[var(--panel-muted)]">
          JSON
        </span>
      </div>
      <pre
        className={cn(
          'fine-scrollbar overflow-auto font-mono text-[11px] leading-6 text-[var(--panel-muted)]',
          compact ? 'max-h-[180px]' : 'max-h-[300px]',
        )}
      >
        {formatJson(data)}
      </pre>
    </div>
  )
}

export function MiniInfoList({
  items,
}: {
  items: Array<{ label: string; value: string }>
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4" key={item.label}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function SignalPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'teal'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs',
        tone === 'gold' && 'bg-[var(--gold-soft)] text-[var(--panel)]',
        tone === 'teal' && 'bg-[var(--teal-soft)] text-[var(--panel)]',
        tone === 'neutral' && 'bg-white/75 text-[var(--foreground-soft)]',
      )}
    >
      {children}
    </span>
  )
}

export function StageCard({
  stage,
  active,
  onClick,
}: {
  stage: PipelineStageResult
  active: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={cn(
        'group min-w-[260px] rounded-[26px] border p-4 text-left transition duration-200',
        active
          ? 'border-transparent bg-[var(--panel)] text-white shadow-[0_20px_44px_rgba(16,34,49,0.22)]'
          : 'border-[var(--line)] bg-white/74 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-white',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              'text-[11px] uppercase tracking-[0.22em]',
              active ? 'text-white/55' : 'text-[var(--foreground-soft)]',
            )}
          >
            {stage.agentLabel}
          </p>
          <p className="mt-2 font-medium text-base leading-6">{stage.title}</p>
        </div>
        <StatusBadge status={stage.status} />
      </div>
      <p className={cn('mt-4 text-sm leading-6', active ? 'text-white/70' : 'text-[var(--foreground-soft)]')}>
        {stage.description}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className={cn(active ? 'text-white/55' : 'text-[var(--foreground-soft)]')}>
          Score {formatPercent(stage.score)}
        </span>
        <span className={cn('inline-flex items-center gap-1', active ? 'text-white/75' : 'text-[var(--foreground)]')}>
          Inspect
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  )
}

export function TraitMeter({
  label,
  value,
  confidence,
  timestamp,
}: {
  label: string
  value: string
  confidence: number
  timestamp: string
}) {
  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-soft)]">{label}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{value}</p>
        </div>
        <span className="rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono text-[11px] text-white">
          {formatConfidence(confidence)}
        </span>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
        freshness {formatDateTime(timestamp)}
      </p>
    </div>
  )
}
