import { AI_ACTIONS } from '#/constants/ai-actions'
import { callAiModel } from '#/services/ai'
import { handleErrResponse } from '#/utils/handle-err-response'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()
    //! check if the user is pro and has not exhausted their  AI feature usage for the month

    const config = AI_ACTIONS[action as keyof typeof AI_ACTIONS]
    if (!config) {
        return NextResponse.json({ error: 'Unknown AI action' }, { status: 404 })
    }

    const body = await req.json()
    const validated = config.schema.safeParse(body)
    if (!validated.success) {
        return NextResponse.json({ error: validated.error.format() }, { status: 400 })
    }

    try {
        const result = await callAiModel({
            model: config.model,
            input: validated.data,
            responseType: config.responseType,
        })
        if (config.responseType === 'binary') {
            return NextResponse.json({
                result: (result.buffer as Buffer).toString('base64'),
                type: 'success',
                contentType: result.contentType
            })
        }
        return NextResponse.json({
            type: 'success',
            response: result
        })
    } catch (err) {

        return handleErrResponse(err, NextResponse);
    }
}
