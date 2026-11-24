import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAllRecords, createRecord } from '@/lib/db'

export async function GET() {
  const data = getAllRecords('treatments').sort((a, b) =>
    String(a.idx ?? '').localeCompare(String(b.idx ?? ''))
  )
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const record = createRecord('treatments', body)
  revalidatePath('/', 'page')
  revalidatePath('/treatments', 'page')
  return NextResponse.json(record, { status: 201 })
}
