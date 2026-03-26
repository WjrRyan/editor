import type { PipelineRun } from '@pascal-app/profile-core'

declare global {
  var __profilePlatformRunStore: Map<string, PipelineRun> | undefined
}

function getStore() {
  if (!globalThis.__profilePlatformRunStore) {
    globalThis.__profilePlatformRunStore = new Map<string, PipelineRun>()
  }

  return globalThis.__profilePlatformRunStore
}

export function saveRun(run: PipelineRun) {
  getStore().set(run.id, run)
}

export function readRun(runId: string) {
  return getStore().get(runId) ?? null
}
