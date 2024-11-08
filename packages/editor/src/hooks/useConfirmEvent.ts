import { useEffect } from "react";

export function useConfirmEvent() {
    useEffect(() => {
        const confirmation = (ev: BeforeUnloadEvent) => {
            (ev || window.event).returnValue ="Are you really sure you want to leave?"
        }
        window.addEventListener('beforeunload', confirmation)
        return () => {
            window.removeEventListener('beforeunload', confirmation);
        }
    }, [])
}