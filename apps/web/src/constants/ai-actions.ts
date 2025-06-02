import { z } from 'zod'

export const AI_ACTIONS = {
    generate_image: {
        schema: z.object({
            prompt: z.string().min(1),
            negative_prompt: z.string().optional(),
            height: z.number().min(256).max(2048).default(1024),
            width: z.number().min(256).max(2048).default(1024),
        }),
        model: '@cf/bytedance/stable-diffusion-xl-lightning',
        responseType: 'binary' as const,
    },
    text_to_design: {
        schema: z.object({
            prompt: z.string().min(1),
            version: z.string().optional(),
        }),
        model: '@hf/meta/llama-3.1-8b-instruct-fast',
        responseType: 'json' as const,
    },
}

export type AiActionKey = keyof typeof AI_ACTIONS
