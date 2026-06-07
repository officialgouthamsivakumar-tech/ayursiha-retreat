import { NextResponse } from 'next/server'
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
  return NextResponse.json(record, { status: 201 })
}
