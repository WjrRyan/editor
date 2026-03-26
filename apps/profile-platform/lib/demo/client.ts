'use client'

import type {
  AgentReplay,
  AgentUseCase,
  DemoCatalog,
  PersonaId,
  PipelineRun,
} from '@pascal-app/profile-core'

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function fetchDemoCatalog() {
  return requestJson<DemoCatalog>('/api/demo/catalog', { cache: 'no-store' })
}

export function triggerDemoRun(personaId: PersonaId) {
  return requestJson<PipelineRun>('/api/demo/run', {
    method: 'POST',
    body: JSON.stringify({ personaId }),
  })
}

export function fetchRun(runId: string) {
  return requestJson<PipelineRun>(`/api/demo/runs/${runId}`, {
    cache: 'no-store',
  })
}

export function queryAgent(personaId: PersonaId, useCase: AgentUseCase, prompt: string) {
  return requestJson<AgentReplay>('/api/demo/agent-query', {
    method: 'POST',
    body: JSON.stringify({ personaId, useCase, prompt }),
  })
}
