import flw from "#/features/subscriptions/helpers/loadFLW";
import { db, eq, schema } from "@designr/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    const webhook = flw.webhook({

        chargeCompleted: async (data) => {
            const resData = data.data;
            const flwSubId = resData.id;
            if (resData.status === 'failed') {
                console.error("Flutterwave transaction falied");
                return;
            }
            // Assert meta data
            const meta = (data as unknown as {
                meta_data: {
                    planName?: typeof schema.PlanEnum.enumValues[number],
                    interval?: string
                    email?: string
                }
            }).meta_data;
            if (!meta?.planName) {
                console.warn("No planName in meta, skipping...");
                return;
            }

            const customerEmail = meta.email;
            if (!customerEmail) {
                console.warn("No customer email in charge data.");
                return;
            }

            // Find user
            const user = await db.select()
                .from(schema.users)
                .where(eq(schema.users.email, customerEmail))
                .then(res => res[0]);

            if (!user) {
                console.warn(`User not found for email: ${customerEmail}`);
                return;
            }

            // Check if already processed
            const alreadyExists = await db.select()
                .from(schema.subscriptions)
                .where(eq(schema.subscriptions.flwSubscriptionId, flwSubId))
                .then(res => res.length > 0);

            if (alreadyExists) {
                console.log("Subscription already handled.");
                return;
            }
            // set the expiry date as follows
            const expiresAt = new Date(resData.created_at);
            if (meta.interval === 'yearly') {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            }
            else {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            }

            await db.update(schema.subscriptions)
                .set({
                    plan: meta.planName,
                    flwSubscriptionId: flwSubId,
                    expiresAt,
                    active: true,
                })
                .where(eq(schema.subscriptions.userId, user.id));

            console.log(`Activated plan ${meta.planName} for ${customerEmail}`);
        },

        subscriptionCancelled: async (data) => {
            const resData = data.data;
            const email = resData.customer?.email;

            if (!email) {
                console.warn("No email in webhook payload");
                return;
            }

            const user = await db.select()
                .from(schema.users)
                .where(eq(schema.users.email, email))
                .then(res => res[0]);

            if (!user) {
                console.warn(`User not found for email: ${email}`);
                return;
            }

            const [subscription] = await db.select()
                .from(schema.subscriptions)
                .where(eq(schema.subscriptions.userId, user.id));

            if (!subscription || subscription.plan === "FREE") {
                console.log(`User ${email} already on FREE or no active subscription`);
                return;
            }

            await db.update(schema.subscriptions)
                .set({
                    plan: "FREE",
                    flwSubscriptionId: null,
                    expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    active: true,
                })
                .where(eq(schema.subscriptions.userId, user.id));

            console.log(`User ${email} downgraded to FREE`);
        },

    });
    const headersList = await headers()
    const body = await req.json();
    const verifyHash = headersList.get('verif-hash');
    console.log("the body: ", JSON.stringify(body, null, 2))
    console.log("the headers: ", verifyHash)
    console.log("secret hash: ", process.env.FLW_SECRET_HASH)
    const isValid = webhook.isValidWebhook({
        headers: {
            'verif-hash': verifyHash
        }
    });
    console.log("isValid: ", isValid)
    if (!isValid) return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });


    await webhook.handleEvent(body);

    return NextResponse.json({ received: true });
}
