import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSettings, saveSettings } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(request: Request) {
  const body = await request.json()
  const saved = saveSettings(body)
  revalidatePath('/', 'layout')
  revalidatePath('/about', 'page')
  revalidatePath('/treatments', 'page')
  return NextResponse.json(saved)
}
