import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  // Prevent path traversal
  const safe = basename(filename)
  const filePath = join(process.cwd(), 'public', 'uploads', safe)
  if (!existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const ext = extname(safe).toLowerCase()
  const mime = MIME[ext] ?? 'application/octet-stream'
  const buffer = readFileSync(filePath)
  return new Response(buffer, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
