import animationData from './chemark.json'
import { SubscriptionSuccessClient } from "#/features/subscriptions/components/success-client";
export const metadata = {
    title: "Subscription Successful | Designr",
    description: "Thank you for subscribing to Designr PRO. Enjoy enhanced features and seamless design tools tailored for you.",
    openGraph: {
        title: "Subscription Successful | Designr",
        description: "You're now a PRO member on Designr. Discover all the features included in your plan.",
        url: `${process.env.NEXT_PUBLIC_URL}/success`,
        siteName: "Designr",
        images: [
            {
                width: 1200,
                height: 630,
                alt: "Subscription Confirmed",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Subscription Successful | Designr",
        description: "You're now subscribed to Designr PRO. Enjoy your new features!",
    },
};

export default function SubscriptionSuccessPage() {
    return <SubscriptionSuccessClient
        animationData={animationData}
    />
}

