import { getDemoCatalog } from '@pascal-app/profile-core'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(getDemoCatalog())
}
