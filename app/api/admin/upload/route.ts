import { NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type))
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF images are allowed' }, { status: 400 })

  const MAX_BYTES = 5 * 1024 * 1024
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image must be smaller than 5 MB' }, { status: 413 })

  const ext = extname(file.name).toLowerCase() || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}

export async function DELETE(request: Request) {
  const body = await request.json() as { path?: string }
  const filePath = body.path ?? ''
  if (!filePath.startsWith('/uploads/')) return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  const abs = join(process.cwd(), 'public', filePath)
  if (existsSync(abs)) unlinkSync(abs)
  return NextResponse.json({ ok: true })
}
