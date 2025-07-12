'use client';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Player from "lottie-react";
import { Button } from "@designr/ui/components/button";
import { HomeIcon } from "lucide-react";
import { LINKS } from "#/constants/links";
type Props = {
    animationData: unknown
}
export function SubscriptionSuccessClient({ animationData }: Props) {
    const searchParms = useSearchParams();
    const router = useRouter();
    return (
        <section className="px-4 py-10 relative bg-white min-h-screen w-full">
            <header className="top-0 py-2 h-16 inset-x-0 px-6 fixed bg-white/10 w-full backdrop-blur-md flex items-center space-x-3 z-50">
                <Image src="/logo.svg" alt="Designr Logo" width={40} height={40} />
                <span className="text-xl font-bold text-primary">Designr</span>
            </header>

            <div className="max-w-2xl mx-auto pt-32 pb-20 flex flex-col items-center text-center">
                <Player
                    autoplay
                    loop={false}
                    animationData={animationData}
                    width={200}
                    height={200}
                    className="size-[200px]"
                />
                <h1 className="text-3xl font-semibold text-primary mt-5">
                    Thank You for Subscribing!
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    You’re now on the <strong>PRO – <span className="capitalize">{searchParms.get('interval') ?? 'Monthly'}</span></strong> plan.
                </p>
                <Button
                    onClick={() => router.replace(LINKS.DASHBOARD)}
                    role="navigation"
                    className="mt-5"
                >
                    <HomeIcon />
                    Go to Dashboard
                </Button>
            </div>
        </section>
    );
}
