import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(request: Request) {
  const body = await request.json()
  const saved = saveSettings(body)
  return NextResponse.json(saved)
}
