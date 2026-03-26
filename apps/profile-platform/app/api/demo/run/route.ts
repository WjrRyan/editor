import { buildPipelineRun, personaIds } from '@pascal-app/profile-core'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { saveRun } from '@/lib/demo/server-run-store'

const RunRequestSchema = z.object({
  personaId: z.enum(personaIds),
})

export async function POST(request: Request) {
  const json = await request.json()
  const { personaId } = RunRequestSchema.parse(json)
  const run = buildPipelineRun(personaId)

  saveRun(run)

  return NextResponse.json(run)
}
