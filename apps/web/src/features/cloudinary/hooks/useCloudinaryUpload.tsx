/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Dialog, DialogContent } from '@designr/ui/components/dialog';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@designr/ui/components/button';
import { uploadImageToCloudinary } from '#/services/cloudinary';

type UploadImageFn = (
    dataUrl: string,
    onSuccess: (url: string) => void,
    onError?: (err: Error) => void
) => Promise<void>;

export function useCloudinaryUpload(): {
    upload: UploadImageFn;
    DialogUI: () => JSX.Element;
} {
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState<string | null>(null);
    const [abortController, setAbortController] = React.useState<AbortController | null>(null);

    const upload: UploadImageFn = async (dataUrl, onSuccess, onError) => {
        const controller = new AbortController();
        setAbortController(controller);

        const blob = await (await fetch(dataUrl)).blob();
        const formData = new FormData();
        formData.append('file', blob);

        setImage(dataUrl);
        setOpen(true);

        try {
            const url = await uploadImageToCloudinary(formData);
            if (typeof url !== 'string') {
                throw new Error(url?.message || 'Unknown error occurred during upload');
            }
            setOpen(false);
            setImage(null);
            onSuccess(url);
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                onError?.(err);
            }
            setOpen(false);
            setImage(null);
        }
    };

    const cancelUpload = () => {
        abortController?.abort();
        setOpen(false);
        setImage(null);
    };

    const DialogUI = () => (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col items-center space-y-4">
                {image && (
                    <img
                        src={image}
                        alt="Preview"
                        className="w-full rounded-md border shadow-sm"
                    />
                )}
                <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Uploading image...</span>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={cancelUpload}
                    className="flex items-center"
                >
                    <XCircle className="mr-1 size-4" />
                    Cancel Upload
                </Button>
            </DialogContent>
        </Dialog>
    );

    return { upload, DialogUI };
}
