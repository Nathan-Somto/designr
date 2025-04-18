import * as React from "react";


const IS_SERVER = typeof window === "undefined";

export default function useIsOnline() {
    const [isOnline, setIsOnline] = React.useState(
        IS_SERVER ? false : window.navigator.onLine ?? true
    );

    React.useEffect(() => {
        if (IS_SERVER) return;
        window?.addEventListener("online", () => setIsOnline(true));
        window?.addEventListener("offline", () => setIsOnline(false));

        return () => {
            window?.removeEventListener("online", () => setIsOnline(true));
            window?.removeEventListener("offline", () => setIsOnline(false));
        };
    }, []);

    return isOnline;
}