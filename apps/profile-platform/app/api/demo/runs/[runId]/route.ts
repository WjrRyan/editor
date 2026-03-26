import { NextResponse } from 'next/server'
import { readRun } from '@/lib/demo/server-run-store'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const run = readRun(runId)

  if (!run) {
    return NextResponse.json({ message: 'Run not found' }, { status: 404 })
  }

  return NextResponse.json(run)
}
