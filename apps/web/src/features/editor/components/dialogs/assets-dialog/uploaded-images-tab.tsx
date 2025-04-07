/* eslint-disable no-unused-vars */
import { Button } from "@designr/ui/components/button";
import { DialogHeader, DialogTitle } from "@designr/ui/components/dialog";
import { Input } from "@designr/ui/components/input";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";

export function UploadedImagesTab({ onSelect }: { onSelect: (image: string) => void }) {
    const uploadedImages = [
        '/images/img1.jpg',
        '/images/img2.jpg',
        '/images/img3.jpg',
    ];
    const handleImageDelete = () => {

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
            <div className="grid grid-cols-4 gap-4 overflow-y-auto">
                {uploadedImages.map((img, index) => (
                    <div
                        key={img}
                        className="relative w-full group  rounded-md cursor-pointer"
                        onClick={() => onSelect(img)}
                    >
                        <Image
                            src={img}
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
                                handleImageDelete();
                            }}
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};
