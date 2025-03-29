import { Button } from "@designr/ui/components/button";
import Image from "next/image";

export default function ComingSoon() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src="/pattern.png"
                    alt="Pattern Background"
                    fill
                    className="opacity-30 object-cover"
                />
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute z-1 h-[30vh] w-full inset-x-0 opacity-30 rounded-full bottom-0  bg-gradient-to-b from-primary/50 to-[rgb(156,202,254)]/50 blur-xl"></div>

            {/* Header */}
            <header className="absolute top-6 left-6 flex items-center space-x-3">
                <Image src="/logo.svg" alt="Designr Logo" width={40} height={40} />
                <span className="text-xl font-bold text-primary">Designr</span>
            </header>

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                <h1 className="text-4xl min-[500px]:text-5xl font-bold md:text-6xl">We’re Launching Soon 🚀</h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl max-w-lg mx-auto">
                    Get ready for something amazing. Stay tuned!
                </p>

                {/* Email Input with Button Inside */}
                <div className="mt-6 w-full max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-6 py-4 pr-28 shadow-md  rounded-[0.85rem] text-gray-800 focus:ring-2 focus:ring-white"
                        />
                        <Button className="absolute top-1/2 right-2 transform -translate-y-1/2  font-semibold">
                            Notify Me
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
