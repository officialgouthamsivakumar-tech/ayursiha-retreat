import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getRecord, updateWithReorder, deleteRecord } from '@/lib/db'

function revalidateTreatments(slug?: string) {
  revalidatePath('/', 'page')
  revalidatePath('/treatments', 'page')
  if (slug) revalidatePath(`/treatments/${slug}`, 'page')
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = getRecord('treatments', id)
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(record)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const record = updateWithReorder('treatments', id, body)
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  revalidateTreatments(record.slug as string | undefined)
  return NextResponse.json(record)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = getRecord('treatments', id)
  const ok = deleteRecord('treatments', id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  revalidateTreatments(existing?.slug as string | undefined)
  return NextResponse.json({ ok: true })
}
