import { Button } from "@designr/ui/components/button";
import { cn } from "@designr/ui/lib/utils";
import { Loader } from "lucide-react";
export function LoadMore({
    onLoadMore,
    loading = false,
    isDisabled = false,
    hasNext = true,
    className = ''
}: {
    onLoadMore: () => Promise<void>;
    loading?: boolean;
    isDisabled?: boolean;
    hasNext?: boolean;
    className?: string;
}) {
    return (
        <>
            {hasNext && (
                <div className={cn("w-full flex items-center justify-center", className)}>
                    <Button
                        disabled={isDisabled}
                        onClick={onLoadMore}
                        variant="ghost"
                    >
                        {loading ? (
                            <Loader className="size-5 animate-spin" />
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}