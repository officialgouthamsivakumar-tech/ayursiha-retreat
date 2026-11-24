import { NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const MAX_BYTES = 200 * 1024 * 1024

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
  if (!allowedTypes.includes(file.type))
    return NextResponse.json({ error: 'Only MP4, WebM or MOV files are allowed' }, { status: 400 })

  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Video must be smaller than 200 MB' }, { status: 413 })

  const ext = extname(file.name).toLowerCase() || '.mp4'
  const filename = `${randomUUID()}${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/api/uploads/${filename}` })
}

export async function DELETE(request: Request) {
  const body = await request.json() as { path?: string }
  const filePath = body.path ?? ''
  const isOld = filePath.startsWith('/uploads/')
  const isNew = filePath.startsWith('/api/uploads/')
  if (!isOld && !isNew) return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  const filename = filePath.split('/').pop() ?? ''
  const abs = join(process.cwd(), 'public', 'uploads', filename)
  if (existsSync(abs)) unlinkSync(abs)
  return NextResponse.json({ ok: true })
}
