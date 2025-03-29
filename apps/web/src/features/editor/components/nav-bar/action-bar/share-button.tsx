import { Access } from "#/features/editor/types";
import { Button } from "@designr/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogClose,
} from "@designr/ui/components/dialog";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@designr/ui/components/select";
import { LinkIcon, XIcon } from "lucide-react";
import React from "react";
import { shareOptions } from "../data";

export default function ShareButton() {
    const [viewAccess, setViewAccess] = React.useState<Access>("public");
    const [editAccess, setEditAccess] = React.useState<Access>("public");

    const currentPageUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(currentPageUrl);
        //! Show toaster
    };

    const updateProjectAccess = () => {
        //! Call API with the new access levels
    };

    const getSelectedOption = (access: Access) => {
        const index = access === "public" ? 0 : 1;
        return shareOptions[index];
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="!h-8" aria-label="Share">
                    <LinkIcon className="!size-3.5" />
                    <span>Share</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="gap-0 py-2 px-0 [&>button]:hidden">
                <DialogHeader
                    className="flex  px-6 !flex-row justify-between items-center space-y-0 space-x-0"
                >
                    <h2 className="text-lg font-semibold">Share Project</h2>
                    <DialogClose >
                        <XIcon className="size-4 text-muted-foreground" />
                    </DialogClose>
                </DialogHeader>
                <hr className="my-4" />
                <div className="mb-4 px-6">
                    {/* Share Link */}
                    <h2 className="text-sm font-medium mb-2">Share via Link</h2>
                    <div className="flex items-center gap-x-2">
                        <input
                            type="text"
                            contentEditable={false}
                            className="w-full focus-within:!ring-transparent focus-visible:!ring-transparent outline-none cursor-default p-2 h-[2.25rem] rounded-[0.25rem] text-primary/70 text-sm placeholder:text-lg placeholder:font-medium border placeholder:text-primary bg-accent border-muted-foreground"
                            placeholder={currentPageUrl || "https://example.com"}
                            value={currentPageUrl}
                            readOnly
                        />
                        <Button onClick={handleCopy} size='sm'>Copy</Button>
                    </div>

                    {/* Share Choices */}
                    <div className="mt-10">
                        <h3 className="text-sm font-medium mb-2">Who can view?</h3>
                        <Select value={editAccess} onValueChange={(value) => setViewAccess(value as Access)}>
                            <SelectTrigger
                                className="focus-visible:ring-transparent"
                            >
                                <div className="flex text-muted-foreground text-xs items-center gap-2">
                                    {getSelectedOption(viewAccess)?.Icon()}
                                    {getSelectedOption(viewAccess)?.label}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {shareOptions.map(({ label, Icon, action }) => (
                                    <SelectItem
                                        key={action}
                                        value={action}
                                        className="py-3"
                                    >
                                        <div className="flex items-center gap-2 [&>svg]:size-3.5 text-xs">
                                            <Icon />
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-5">
                        <h3 className="text-sm font-medium mb-2">Who can edit?</h3>
                        <Select value={editAccess} onValueChange={(value) => setEditAccess(value as Access)}>
                            <SelectTrigger
                                className="focus-visible:ring-transparent"
                            >
                                <div className="flex text-muted-foreground text-xs items-center gap-2">
                                    {getSelectedOption(editAccess)?.Icon()}
                                    {getSelectedOption(editAccess)?.label}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {shareOptions.map(({ label, Icon, action }) => (
                                    <SelectItem
                                        key={action}
                                        value={action}
                                        className="py-3"
                                    >
                                        <div className="flex items-center gap-2 [&>svg]:size-3.5 text-xs">
                                            <Icon />
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div
                        className="flex justify-end w-full mt-4"
                    >
                        <Button onClick={updateProjectAccess} className="min-w-[190px]">Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
