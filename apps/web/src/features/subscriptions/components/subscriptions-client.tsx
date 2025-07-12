"use client";
import { LINKS } from "#/constants/links";
import { useApi } from "#/hooks/useApi";
import { useConfirm } from "#/hooks/useConfirm";
import { cancelSubscription, getSubscriptionData } from "#/services/subscriptions";
import { promiseCatch } from "#/utils/promise-catch";
import { Button } from "@designr/ui/components/button";
import { cn } from "@designr/ui/lib/utils";
import { AlertTriangleIcon, Loader2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function SubscriptionClient() {
    const [open, setOpen] = React.useState(false);
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
    const {
        data,
        isFetching,
        error
    } = useApi({
        fetchFn: getSubscriptionData
    })
    const subscription = data;
    const isFree = subscription?.plan === "FREE";
    const router = useRouter();
    const handleSubscriptionCancel = async () => {
        setOpen(true);
    }
    return (
        <main className="max-w-2xl px-4 py-10  space-y-6">
            {
                error !== null ? <div className="p-6 space-y-2 bg-white rounded-lg shadow">
                    <h3 className={`text-sm font-semibold px-3 py-1 max-w-fit rounded-full bg-gray-200 text-gray-700`}>
                        Current Plan
                    </h3>
                    <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                        <AlertTriangleIcon className="size-6 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            Failed to load Subscription Status
                        </p>
                    </div>
                </div> :
                    (isFetching || data === null) ? (
                        <div className="flex justify-center py-2 h-screen w-full">
                            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            {/* Active Plan */}
                            <section className="p-6 space-y-2 bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-y-2">
                                        <span
                                            className={`text-sm font-semibold px-3 py-1 max-w-fit rounded-full bg-gray-200 text-gray-700`}
                                        >
                                            Current Plan
                                        </span>
                                        <h2 className={cn("text-3xl font-semibold mt-0.5 text-gray-700 capitalize", !isFree && 'text-green-800')}>{subscription?.plan}</h2>
                                        {/* message suitable for pro and free */}
                                        <p className="text-sm text-muted-foreground mt-2.5">
                                            {isFree
                                                ? "Enjoy unlimited designs with our free plan."
                                                : "You are currently subscribed to the Pro plan."
                                            }
                                        </p>
                                    </div>
                                    {/* Price */}
                                    <div className="text-sm font-medium ">
                                        {isFree ? "₦0/month" : "₦6,500/month"}
                                    </div>
                                </div>

                                {/* Renewal */}
                                {!isFree && subscription?.expiresAt && (
                                    <p className="text-sm text-muted-foreground">
                                        Renews on{" "}
                                        <span className="font-medium">
                                            {new Date(subscription.expiresAt).toLocaleDateString()}
                                        </span>
                                    </p>
                                )}

                                {/* Usage */}

                                {/* Change Plan Button */}
                                <div className="pt-4 flex items-center justify-between">
                                    <Button
                                        onClick={() => router.push(LINKS.PRICING)}
                                    >
                                        Change Plan
                                    </Button>
                                    {
                                        !isFree && (
                                            <Button
                                                variant="destructive"
                                                className="ml-2"
                                                onClick={handleSubscriptionCancel}
                                            >
                                                <XIcon className="size-4" />
                                                Cancel Subscription
                                            </Button>
                                        )
                                    }
                                </div>
                            </section>
                            {isFree && (
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold mb-2">Usage</h2>
                                    <p className="text-sm font-medium text-gray-700">
                                        Organizations used:{" "}
                                        <span className="font-semibold">
                                            {subscription.usage.organizations.created}/{subscription.usage.organizations.limit}
                                        </span>
                                    </p>
                                    <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-primary rounded-full"
                                            style={{
                                                width: `${(subscription.usage.organizations.created / subscription.usage.organizations.limit) * 100
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* reach out for complaints */}
                            <section className="">
                                <p className="text-sm text-muted-foreground inline">
                                    If you have any questions or need assistance with your subscription, please contact our support team. {' '}
                                </p>
                                <Button
                                    variant="link"
                                    //onClick={() => (window.location.href = "/support")}
                                    className="text-sm inline-flex !px-0"
                                >
                                    Contact Support
                                </Button>
                            </section>
                        </>
                    )
            }

            <ConfirmDialog />
        </main>
    );
}
