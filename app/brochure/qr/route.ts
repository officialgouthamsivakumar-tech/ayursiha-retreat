import QRCode from 'qrcode'

// QR code that opens the brochure. Print it on flyers, room cards, the front desk.
//   /brochure/qr               → SVG (scales to any print size)
//   /brochure/qr?format=png    → 1024px PNG (add &size=2048 for larger)
// The target defaults to the live site; override with BROCHURE_URL in .env.
const TARGET = process.env.BROCHURE_URL || 'https://www.ayursiharetreat.com/brochure'
const COLOR = { dark: '#035260', light: '#ffffff' }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const download: Record<string, string> = params.has('download')
    ? { 'Content-Disposition': 'attachment; filename="ayursiha-brochure-qr.' + (params.get('format') === 'png' ? 'png' : 'svg') + '"' }
    : {}

  if (params.get('format') === 'png') {
    const size = Math.min(4096, Math.max(256, Number(params.get('size')) || 1024))
    const png = await QRCode.toBuffer(TARGET, { type: 'png', width: size, margin: 2, errorCorrectionLevel: 'M', color: COLOR })
    return new Response(new Uint8Array(png), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400', ...download },
    })
  }

  const svg = await QRCode.toString(TARGET, { type: 'svg', margin: 2, errorCorrectionLevel: 'M', color: COLOR })
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400', ...download },
  })
}
