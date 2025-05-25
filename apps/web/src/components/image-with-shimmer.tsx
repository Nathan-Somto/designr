import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@designr/ui/lib/utils";

export function ImageWithShimmer({
    className,
    ...props
}: ImageProps & { className?: string }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn("relative w-full h-32 rounded-md overflow-hidden", className)}>
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <Image
                {...props}
                onLoad={() => setLoaded(true)}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    loaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
