import { NextResponse } from 'next/server'
import { getAllRecords, createRecord } from '@/lib/db'

export async function GET() {
  const data = getAllRecords('faqs').sort((a, b) =>
    String(a.category ?? '').localeCompare(String(b.category ?? '')) ||
    Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  )
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json(createRecord('faqs', body), { status: 201 })
}
