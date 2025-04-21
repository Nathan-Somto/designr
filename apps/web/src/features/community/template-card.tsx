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
    Pencil,
} from "lucide-react";
import ProBadge from "./pro-badge";
export function TemplateCard({
    template,
    onPreview,
    handleEditorOpen
}: {
    template: {
        name: string
        isStarred: boolean
        image: string
        isPro?: boolean
        id: string
    };
    onPreview: () => void;
    handleEditorOpen: (id: string) => Promise<void>;
}) {
    const [starred, setStarred] = React.useState(template.isStarred);

    return (
        <div className="relative group overflow-hidden rounded-md border border-border transition hover:shadow-md">
            <img
                src={template.image}
                alt={template.name}
                className="w-full object-cover aspect-video h-56"
            />
            <div className="absolute cursor-pointer inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 ease-in flex items-center justify-center">
                <span className="text-white text-sm font-medium">Open in Editor</span>
                <div className="absolute top-2 right-2 flex gap-1">
                    <StarButton
                        isStarred={starred}
                        onToggle={() => setStarred(!starred)} />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" className="px-2 hvoer:bg-transparent">
                                <MoreHorizontal className="size-4 text-black" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 !px-0">
                            <div className="mb-2 text-sm font-semibold px-4">{template.name}</div>
                            <Button
                                variant="ghost"
                                onClick={async () => await handleEditorOpen.bind(template.id)}
                                className="w-[90%] mx-auto justify-start text-sm ">
                                <Pencil className="size-4 mr-1" />
                                Open in Editor
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-[90%] mx-auto justify-start text-sm"
                                onClick={onPreview}
                            >
                                <Eye className="size-4 mr-1" />
                                Preview Template
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