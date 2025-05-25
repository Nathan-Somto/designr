import { SERVICES_TO_RATELIMIT } from '#/constants/services-to-rate-limit';
import { checkAndUpdateRateLimit } from '#/services/rate-limit';
import { getCurrentUser } from '#/services/users';
import { AppError, BadRequestError } from '@designr/api-errors';
import { NextRequest, NextResponse } from 'next/server';
import { createApi } from 'unsplash-js'
const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY ?? '',
    fetch
})
export const revalidate = 8640;
export const GET = async (req: NextRequest) => {
    try {
        const user = await getCurrentUser();
        await checkAndUpdateRateLimit({
            userId: user.id,
            service: SERVICES_TO_RATELIMIT.UNSPLASH.service,
            limit: SERVICES_TO_RATELIMIT.UNSPLASH.limit
        });
        const res = await unsplash.photos.getRandom({
            count: 40
        })
        if (res.errors) {
            throw new BadRequestError(res.errors.map(err => err).join(', '))
        }
        return NextResponse.json({
            type: 'success' as const,
            images: Array.isArray(res.response) ? res.response : [res.response]
        })
    }
    catch (error) {
        let response;
        if (error instanceof AppError) {
            console.error(error.getErrorLogMessage());
            response = {
                message: error.message,
                statusCode: error.statusCode,
                type: 'error' as const,
            }
        }
        else {
            response = {
                message: 'Internal Server Error',
                statusCode: 500,
                type: 'error' as const
            }
        }
        return NextResponse.json({
            ...response
        })

    }
}