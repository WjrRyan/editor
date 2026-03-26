import { createAgentReplay, personaIds } from '@pascal-app/profile-core'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const AgentQuerySchema = z.object({
  personaId: z.enum(personaIds),
  useCase: z.enum(['recommendation', 'support']),
  prompt: z.string().trim().min(1).max(500),
})

export async function POST(request: Request) {
  const json = await request.json()
  const { personaId, useCase, prompt } = AgentQuerySchema.parse(json)
  const replay = createAgentReplay(personaId, useCase, prompt)

  const response =
    prompt.length > 0
      ? {
          ...replay,
          response: `关于“${prompt}”，${replay.response}`,
        }
      : replay

  return NextResponse.json(response)
}
