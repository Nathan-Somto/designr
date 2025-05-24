import React from "react";
import StarButton from "./template-star-button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@designr/ui/components/popover";
import { Button } from "@designr/ui/components/button";
import {
    MoreHorizontal,
    Eye,
    FlagIcon,
} from "lucide-react";
import ProBadge from "./pro-badge";
import Image from "next/image";
import { useStarTemplate } from "#/hooks/useStarTemplate";
import { toast } from "sonner";
export function TemplateCard({
    template,
    onPreview,
    type,
    isDisabled = false
}: {
    template: {
        name: string
        isStarred: boolean
        image: string
        isPro?: boolean
        id: string
    };
    onPreview: () => void;
    type: 'community' | 'favourites'
    isDisabled?: boolean
}) {
    const starred = template.isStarred;
    const {
        starTemplate,
        isPending
    } = useStarTemplate();
    return (
        <div
            style={{
                pointerEvents: isDisabled ? 'none' : 'auto',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1
            }}
            className="relative group overflow-hidden rounded-md border border-border transition hover:shadow-md">
            <figure
                className="h-56 relative w-full"
            >
                <Image
                    src={template.image}
                    alt={template.name}
                    fill
                    className="!w-[90%] origin-center object-cover object-center aspect-video h-56"
                />
            </figure>
            <div
                style={{
                    pointerEvents: isDisabled ? 'none' : 'auto',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
                aria-disabled={isDisabled}
                role="button"
                onClick={onPreview}
                className="absolute cursor-pointer inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 ease-in flex items-center justify-center">
                <span className="text-white text-sm font-medium">Preview Template</span>
                <div className="absolute top-2 right-2 flex gap-1">
                    <StarButton
                        disabled={isPending}
                        isStarred={starred}
                        onToggle={async () => await starTemplate(template.id, !starred, type)} />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                size="icon" variant="ghost" className="px-2 hvoer:bg-transparent">
                                <MoreHorizontal className="size-4 text-black" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 !px-0">
                            <div className="mb-2 text-sm font-semibold px-4">{template.name}</div>
                            <Button
                                variant="ghost"
                                className="w-[90%] flex mx-auto justify-start text-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreview();
                                }}
                            >
                                <Eye className="size-4 mr-1" />
                                Preview Template
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    toast.success("successfully reported template")
                                }}
                                className="w-[90%] flex mx-auto justify-start text-sm ">
                                <FlagIcon className="size-4 mr-1" />
                                Report
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="absolute bottom-2 left-3 z-[15]">
                {template.isPro && <ProBadge />}
            </div>
        </div>
    );
};