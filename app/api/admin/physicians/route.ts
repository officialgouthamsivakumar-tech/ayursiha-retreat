import { NextResponse } from 'next/server'
import { getAllRecords, createRecord } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getAllRecords('physicians'))
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json(createRecord('physicians', body), { status: 201 })
}
