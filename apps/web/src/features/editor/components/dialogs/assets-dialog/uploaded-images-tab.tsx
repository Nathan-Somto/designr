/* eslint-disable no-unused-vars */
import { ImageWithShimmer } from "#/components/image-with-shimmer";
import { UserMedia } from "#/hooks/useUserMedia";
import { Button } from "@designr/ui/components/button";
import { DialogHeader, DialogTitle } from "@designr/ui/components/dialog";
import { Input } from "@designr/ui/components/input";
import { Loader, Trash2Icon } from "lucide-react";
type Props = {
    onSelect: (image: string) => void,
    loading: boolean,
    data: UserMedia[]
    error: string | null
    onDelete?: (id: string) => Promise<void>
}
export function UploadedImagesTab({ onSelect, loading, error, data, onDelete }: Props) {
    const handleImageDelete = async (id: string) => {
        await onDelete?.(id);
    }
    return (
        <section
            id="editor__uploaded-images-tab"
            className="flex flex-col w-full h-full px-6 space-y-4">
            <DialogHeader>
                <DialogTitle className="text-lg text-left font-bold mb-2">
                    Select an Image
                </DialogTitle>
            </DialogHeader>
            <Input placeholder="Search uploaded images..." />
            {loading && error === null && <div className="h-full w-full flex justify-center items-center " >
                <Loader className="animate-spin" />
            </div>
            }
            {
                error && (
                    <p className="text-destructive text-sm text-center">
                        {error}
                    </p>
                )
            }
            {
                !loading && error === null && (
                    <div className="grid grid-cols-4 gap-4 overflow-y-auto">
                        {
                            data.length === 0 ?
                                <p className="text-muted-foreground text-sm">
                                    No images uploaded yet.
                                </p>
                                : data.map(({ url, id }, index) => (
                                    <div
                                        key={id}
                                        className="relative w-full group  rounded-md cursor-pointer"
                                        onClick={() => onSelect(url)}
                                    >
                                        <ImageWithShimmer
                                            src={url}
                                            alt={`uploaded-${index + 1} photo`}
                                            height={350}
                                            width={350}
                                            className="w-full h-28 object-cover"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="shrink"
                                            className="absolute text-destructive !p-2 h-fit hover:text-destructive top-0.5 right-1 opacity-0 group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageDelete(id);
                                            }}
                                        >
                                            <Trash2Icon className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                    </div>
                )
            }
        </section>
    );
};
