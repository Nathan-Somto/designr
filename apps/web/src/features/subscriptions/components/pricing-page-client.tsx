"use client";

import React from "react";
import { PlanCard } from "./pricing-card";
import { Switch } from "@designr/ui/components/switch";
import { useRouter } from "next/navigation";
import { LINKS } from "#/constants/links";
import Image from "next/image";
import { authClient } from "@designr/auth/client";
import { cancelSubscription, createPaymentLink } from "#/services/subscriptions";
import { promiseCatch } from "#/utils/promise-catch";
import { toast } from "sonner";
import { useConfirm } from "#/hooks/useConfirm";

const plans = [
    {
        name: "Free",
        discretion: `
     Great for hobbies and small projects to unleash your creativity.
    `,
        features: [
            "Up to 5 organizations",
            "Unlimited designs"
        ],
        price: {
            monthly: 0,
            annually: 0,
        },
        highlight: false,
    },
    {
        name: "Pro",
        discretion:
            `Perfect for professionals and teams who need advanced features and support.`,
        features: [
            "Unlimited organizations",
            "Text-to-Design AI",
            "Image Generation AI",
            "Image Transformation AI",
            "Pro Templates",
            "Access to Beta Features",
        ],
        price: {
            monthly: 6500,
            annually: 70000,
        },
        highlight: true,
    },
];

export function PricingPageClient() {
    const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annually">("monthly");
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    // check if the user is logged in.
    const {
        data: session,
        isPending: isSessionPending,
        error: sessionError
    } = authClient.useSession();
    const isLoggedIn = !isSessionPending && !sessionError && !!session?.user;
    const {
        ConfirmDialog
    } = useConfirm({
        title: "Cancel Subscription",
        message: "Are you sure you want to cancel your subscription? You will lose access to Pro features immediately.",
        onConfirm: async () => {
            const res = await promiseCatch(cancelSubscription());
            if (res?.type === "success") {
                toast.success("Subscription cancelled successfully.");
                router.push(LINKS.PRICING);
            } else {
                toast.error("Failed to cancel subscription, please try again later.");
            }
        },
        open,
        onOpenChange: setOpen
    })
    const onSelectPlan = async (planName: string) => {
        if (!isLoggedIn) {
            router.push(LINKS.LOGIN);
            return;
        }
        // if the user is pro and clicks free cancel subscription.
        if (
            planName === 'Free' && session?.user.isPro
        ) {
            setOpen(true);
            return;
        }
        if (planName === 'Pro' && !session?.user.isPro) {
            const res = await promiseCatch(createPaymentLink({
                plan: billingCycle === "monthly" ? "monthly" : "yearly"
            }));
            if (res?.type === "success") {
                window.location.href = res.data;
            } else {
                toast.error("Failed to redirect for payment, please try again later.")
            }
            return;
        }
        toast.success(`You are already subscribed to the ${planName} plan.`);
    }
    return (
        <section className="px-4 py-10 relative bg-white min-h-screen w-full">
            <header className="top-0 py-2 h-16 inset-x-0 px-6 fixed bg-white/10 w-full backdrop-blur-md flex items-center space-x-3">
                <Image src="/logo.svg" alt="Designr Logo" width={40} height={40} />
                <span className="text-xl font-bold text-primary">Designr</span>
            </header>
            <div
                className="max-w-3xl mx-auto mt-10 text-center space-y-4 mb-16 flex flex-col items-center justify-center"
            >
                <h1 className="text-3xl font-semibold text-center">Choose Your Plan</h1>
                <p className="mt-2 text-lg text-center text-muted-foreground">
                    Select the plan that best suits your needs. Enjoy a 30-day money-back guarantee.
                </p>
            </div>
            {/* Plan Toggle */}
            <div className="flex items-center justify-center space-x-4">
                <span className="text-base font-medium">Bill Monthly</span>
                <Switch
                    checked={billingCycle === "annually"}
                    onCheckedChange={(checked) => setBillingCycle(checked ? "annually" : "monthly")}
                />
                <span className="text-base font-medium">Bill Annually</span>
            </div>

            {/* Plans */}
            <div className="flex flex-col items-center justify-center mt-16 space-y-8 lg:flex-row lg:items-stretch lg:space-x-8 lg:space-y-0">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.name}
                        plan={plan}
                        billingCycle={billingCycle}
                        onSelect={() => onSelectPlan(plan.name)}
                        isCurrent={
                            //based on if the user is pro or not
                            (plan.name === 'Pro' && session?.user.isPro) ||
                            (plan.name === 'Free' && !session?.user.isPro)
                        }
                    />
                ))}
            </div>
            <ConfirmDialog />
        </section>
    );
}
