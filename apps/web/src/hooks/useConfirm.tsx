import { useCallback, useRef, useTransition } from "react";
import { Button } from "@designr/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@designr/ui/components/dialog";

type UseConfirmOptions<T> = {
    title: string;
    message: string;
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onConfirm: (signal: AbortSignal) => Promise<T>;
};

export function useConfirm<T>({
    title,
    message,
    open,
    onOpenChange,
    onConfirm,
}: UseConfirmOptions<T>): { ConfirmDialog: () => JSX.Element } {
    const [isPending, startTransition] = useTransition();
    const abortRef = useRef<AbortController | null>(null);

    const handleClose = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        onOpenChange(false);
    }, [onOpenChange]);

    const handleConfirm = useCallback(() => {
        abortRef.current = new AbortController();

        startTransition(async () => {
            try {
                await onConfirm(abortRef.current!.signal);
                handleClose();
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Confirm error:", err);
                }
            }
        });
    }, [onConfirm, handleClose]);

    const handleCancel = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const ConfirmDialog = () => (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline" disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant={'destructive'} disabled={isPending}>
                        {isPending ? "Processing..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return { ConfirmDialog };
}
