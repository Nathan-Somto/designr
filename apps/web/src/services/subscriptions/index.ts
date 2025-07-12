'use server';
import flw from "#/features/subscriptions/helpers/loadFLW"
import { BadRequestError } from "@designr/api-errors";
import { getCurrentUser } from "../users";
import { and, db, eq, schema } from "@designr/db";

export const createPaymentLink = async ({
    plan
}: {
    plan: "monthly" | "yearly";
}
) => {
    const user = await getCurrentUser();
    const planId =
        plan === "monthly"
            ? process.env.FLW_MONTHLY_PRO_PLAN_ID
            : process.env.FLW_YEARLY_PRO_PLAN_ID;
    const res = await flw.payments.initiate({
        tx_ref: `sub-${Date.now()}`,
        amount: plan === "monthly" ? 6500 : 70000,
        currency: "NGN",
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?interval=${plan}`,
        customer: {
            email: user.email,
            name: user.name || "No Name Provided",
        },
        customizations: {
            title: "Designr Pro Subscription",
            description: `Subscribe to ${plan} plan`,
            logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`
        },
        payment_plan: planId,
        meta: {
            planName: 'PRO',
            interval: plan,
            email: user.email
        }
    })
    return {
        data: res.link,
        type: "success" as const
    };
}
export const cancelSubscription = async () => {
    const user = await getCurrentUser();
    if (!user.isPro) {
        throw new BadRequestError("You are not subscribed to a plan.");
    }
    if (!user.subscriptionId) {
        throw new BadRequestError("No subscription found for this user.");
    }
    const res = await flw.subscriptions.cancel({
        id: user.subscriptionId
    });
    //! updates in the webhook.
    return {
        data: res.data,
        type: "success" as const
    };
}
export const getSubscriptionData = async () => {
    const user = await getCurrentUser();
    const res = await db.select().from(schema.subscriptions).where(
        eq(schema.subscriptions.userId, user.id)
    ).limit(1);

    let subscriptionData = res?.[0] ? {
        ...res[0],
        usage: {
            organizations:
            {
                created: 0,
                limit: 0
            }
        }
    } : null;

    if (subscriptionData?.plan === 'FREE') {
        // get the organization usage.
        const res = await db.select(
            {
                created: schema.featureUsage.count
            }
        ).from(schema.featureUsage).where(
            and(
                eq(schema.featureUsage.userId, user.id),
                eq(schema.featureUsage.feature, 'ORGANIZATIONS')
            )
        );
        subscriptionData.usage.organizations.created = res?.[0]?.created ?? 0;
        subscriptionData.usage.organizations.limit = 5;
    }
    console.log("subscriptions data: ", subscriptionData);
    return {
        data: subscriptionData,
        type: 'success' as const
    };
}