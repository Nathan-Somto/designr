/* eslint-disable turbo/no-undeclared-env-vars */
import { InternalServerError, UnauthorizedError } from "@designr/api-errors"
import { getCurrentUser } from "../users"

export async function callAiModel({
    model,
    input,
    responseType,
}: {
    model: string
    input: Record<string, unknown>
    responseType: 'binary' | 'json'
}) {
    const user = await getCurrentUser();
    if (!user.isPro) {
        throw new UnauthorizedError('You need to be a Pro user to access this feature. Please upgrade your account.');
    }
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
        console.log("Model response:", JSON.stringify(json, null, 2));
        // the llm might return a string with ```json or ```md or similar, so we need to extract the JSON part.
        const sanitizedResponse = json.response.replace(/```[a-z]*\n/, '').replace(/```$/, '').trim();
        // If the response is not valid JSON, it will throw an error.
        const parsed = JSON.parse(sanitizedResponse);
        return {
            contentType: 'application/json',
            ...parsed
        }
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.error("Failed to parse model response as JSON:", e.message, json.response);
            throw new InternalServerError('Failed to parse model response as JSON: ' + e.message);
        }
        throw new InternalServerError('Failed to parse model response as JSON: ' + e);
    }
}
