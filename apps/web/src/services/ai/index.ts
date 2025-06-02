/* eslint-disable turbo/no-undeclared-env-vars */
import { InternalServerError } from "@designr/api-errors"

export async function callAiModel({
    model,
    input,
    responseType,
}: {
    model: string
    input: Record<string, unknown>
    responseType: 'binary' | 'json'
}) {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.WORKERS_AI_ACCOUNT_ID}/ai/run/${model}`
    if (!process.env.WORKERS_AI_API_TOKEN) {
        throw new InternalServerError('Cloudflare Workers AI API token is not set');
    }
    if (!process.env.WORKERS_AI_ACCOUNT_ID) {
        throw new InternalServerError('Cloudflare Workers AI Account ID is not set');
    }
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.WORKERS_AI_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!res.ok) {
        const errText = await res.text()
        throw new InternalServerError(`Cloudflare Workers AI failed: ${errText}`)
    }

    if (responseType === 'binary') {
        const contentType = res.headers.get('Content-Type') || 'image/png'
        const arrayBuffer = await res.arrayBuffer()
        return {
            contentType,
            buffer: Buffer.from(arrayBuffer),
        }
    }

    const json = await res.json()
    try {
        const parsed = JSON.parse(json.response)
        return {
            contentType: 'application/json',
            ...parsed
        }
    } catch (e) {
        throw new InternalServerError('Failed to parse model response as JSON')
    }
}
