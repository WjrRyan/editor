import { describe, expect, test } from 'bun:test'
import {
  AgentContextPackSchema,
  PipelineRunSchema,
  buildPipelineRun,
  createAgentReplay,
  personaIds,
} from './demo-data'

describe('profile demo engine', () => {
  test('buildPipelineRun creates a valid run for each persona', () => {
    for (const personaId of personaIds) {
      const run = buildPipelineRun(personaId)
      const parsed = PipelineRunSchema.parse(run)

      expect(parsed.personaId).toBe(personaId)
      expect(parsed.stages).toHaveLength(8)
      expect(parsed.profile.evidence.length).toBeGreaterThan(0)
      expect(parsed.agentReplays).toHaveLength(2)
    }
  })

  test('context pack stays schema-compatible', () => {
    const run = buildPipelineRun('business_road_warrior')
    const pack = AgentContextPackSchema.parse(run.contextPack)

    expect(pack.allowed_use_scope).toContain('recommendation')
    expect(pack.explanations.length).toBeGreaterThan(0)
  })

  test('agent replay keeps persona-specific citations', () => {
    const replay = createAgentReplay('luxury_escape_curator', 'recommendation')

    expect(replay.citations.some((citation) => citation.includes('周年纪念'))).toBe(true)
  })
})
