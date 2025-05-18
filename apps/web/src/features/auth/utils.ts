import { ErrorContext } from "@designr/auth/client";

export const fetchCallback = ({
    setIsPending,
    setError
}: {
    setIsPending?: (value: boolean) => void;
    setError?: (value: string) => void;
}) => {
    return {
        onRequest: () => {
            setIsPending?.(true);
        },
        onResponse: () => {
            setIsPending?.(false);
        },
        onError: (ctx: ErrorContext) => {
            if (ctx.response.status === 404) {
                setError?.("failed to reach servers");
                return
            }
            setError?.(ctx.error.message)
        }
    };
};