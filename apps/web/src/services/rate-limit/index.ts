import { BadRequestError } from "@designr/api-errors";
import { db, schema, eq, and } from "@designr/db";
import { ApiSuccessResponse } from "..";


export async function checkAndUpdateRateLimit({
    userId,
    service,
    limit = 10,
}: {
    userId: string;
    service: string;
    limit?: number;
}): Promise<ApiSuccessResponse<{
    count: number,
    lastCalled: string
}>> {
    const today = new Date().toISOString().slice(0, 10);

    const res = await db.select(
        {
            count: schema.rateLimits.count,
            lastCalled: schema.rateLimits.date,
            id: schema.rateLimits.id
        }
    ).from(schema.rateLimits).where(
        and(
            eq(schema.rateLimits.userId, userId),
            eq(schema.rateLimits.service, service),
            eq(schema.rateLimits.date, today)
        ),
    );
    let existing = res?.[0]
    if (existing && existing.count >= limit) {
        throw new BadRequestError("Rate limit exceeded");
    }
    let lastCalled;
    let count = 1
    if (existing) {
        await db
            .update(schema.rateLimits)
            .set({ count: existing.count + 1 })
            .where(eq(schema.rateLimits.id, existing.id));
        count = existing.count + 1;
        lastCalled = existing.lastCalled;
    } else {
        await db.insert(schema.rateLimits).values({
            userId,
            service,
            date: today,
            count: 1,
        });
        lastCalled = today;
    }
    return {
        count,
        lastCalled,
        type: 'success'
    }
}
