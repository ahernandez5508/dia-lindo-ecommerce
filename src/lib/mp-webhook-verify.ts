import crypto from 'node:crypto'

export type WebhookVerifyInput = {
  signatureHeader: string | null
  requestIdHeader: string | null
  dataId: string
  secret: string
}

export function verifyMpSignature(input: WebhookVerifyInput): boolean {
  if (!input.signatureHeader || !input.secret) return false

  const parts = Object.fromEntries(
    input.signatureHeader.split(',').map(p => {
      const [k, v] = p.trim().split('=')
      return [k, v]
    })
  ) as { ts?: string; v1?: string }

  if (!parts.ts || !parts.v1) return false

  let manifest = `id:${input.dataId};`
  if (input.requestIdHeader) {
    manifest += `request-id:${input.requestIdHeader};`
  }
  manifest += `ts:${parts.ts};`

  const expected = crypto
    .createHmac('sha256', input.secret)
    .update(manifest)
    .digest('hex')

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(parts.v1, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
