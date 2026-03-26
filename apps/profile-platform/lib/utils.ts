import { type ClassValue, clsx } from 'clsx'
import type { PipelineStageResult, StageRuntimeStatus } from '@pascal-app/profile-core'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number) {
  return value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}%`
}

export function formatConfidence(value: number) {
  return `${Math.round(value * 100)} / 100`
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatStageDuration(durationMs: number) {
  return `${(durationMs / 1000).toFixed(1)}s`
}

export function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function stageTone(status: StageRuntimeStatus) {
  if (status === 'running') {
    return 'text-[var(--teal)] bg-[var(--teal-soft)] border-[rgba(79,197,182,0.34)]'
  }

  if (status === 'warning') {
    return 'text-[var(--gold)] bg-[var(--gold-soft)] border-[rgba(215,167,100,0.4)]'
  }

  if (status === 'passed') {
    return 'text-white bg-[rgba(16,34,49,0.88)] border-transparent'
  }

  return 'text-[var(--foreground-soft)] bg-white/70 border-[var(--line)]'
}

export function stageStatusLabel(status: StageRuntimeStatus) {
  if (status === 'running') return 'Running'
  if (status === 'warning') return 'Warning'
  if (status === 'passed') return 'Passed'
  return 'Pending'
}

export function finalStageStatus(stage: PipelineStageResult): StageRuntimeStatus {
  return stage.score >= 90 ? 'passed' : 'warning'
}
