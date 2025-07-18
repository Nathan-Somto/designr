/* eslint-disable @next/next/no-img-element */
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
import { Checkbox } from "@designr/ui/components/checkbox"
import { LinkIcon, XIcon } from "lucide-react";
import React from "react";
import { shareOptions } from "../data";
import { Switch } from "@designr/ui/components/switch";
import { useEditorStore } from "#/features/editor/hooks/useEditorStore";
import { toast } from "sonner";
import { promiseCatch } from "#/utils/promise-catch";
import { saveProject, makeProjectATemplate } from "#/services/projects";
import { useParams } from "next/navigation";
import { uploadImageToCloudinary } from "#/services/cloudinary";

export default function ShareButton() {
    const { editor } = useEditorStore();
    const [viewAccess, setViewAccess] = React.useState<Access>("public");
    const [editAccess, setEditAccess] = React.useState<Exclude<Access, 'public'>>("self");
    const [isTemplate, setIsTemplate] = React.useState(false);
    const [showIdentity, setShowIdentity] = React.useState(true);
    const [isPending, startTransition] = React.useTransition();
    const currentPageUrl = typeof window !== "undefined" ? window.location.href : "";
    const {
        projectId,
    } = useParams();
    const handleCopy = () => {
        navigator.clipboard.writeText(currentPageUrl);
        //! Show toaster
        toast.success("Link copied to clipboard!", {
            duration: 4500
        })
    };

    const updateProjectAccess = async () => {
        if (!projectId && typeof projectId !== 'string' && Array.isArray(projectId)) {
            toast.error("Project ID is not available.");
            return;
        }
        startTransition(async () => {
            let res;
            // check if template is true and call make template if so no need to call save project
            if (isTemplate) {
                // upload to cloudinary
                if (!editor) {
                    toast.error("Editor is not initialized.");
                    return;
                };
                const formData = new FormData();
                // append the data 
                let imageBuffer = `${canvasPreviewUrl}`;
                formData.set('file', imageBuffer);
                const secureImageUrl = await uploadImageToCloudinary(formData);
                if (typeof secureImageUrl != 'string') {
                    toast.error("Failed to upload image");
                    return;
                }
                res = await promiseCatch(makeProjectATemplate({
                    projectId: projectId as string,
                    showUserIdentity: showIdentity,
                    thumbnailUrl: secureImageUrl,
                }));
                // by making it a template, the permissions are automatically set to public
                setViewAccess("public");
            } else {
                res = await promiseCatch(saveProject({
                    projectId: projectId as string,
                    canView: viewAccess.toUpperCase() as Uppercase<Access>,
                    canEdit: editAccess.toUpperCase() as Uppercase<Exclude<Access, 'public'>>,
                }))
            }
            if (res !== undefined && res?.type === 'success') {
                toast.success("Project access updated successfully!")
                return;
            }
            toast.error("Failed to update project access.");
        })
    };

    const getSelectedOption = (access: Access) => {
        const index = access === "public" ? 0 : 1;
        return shareOptions[index];
    }
    const canvasPreviewUrl = React.useMemo(() => {
        if (isTemplate) {
            return editor?.previewCanvas() ?? null
        }
        return null
    }, [isTemplate, editor])
    const userIdentity = 'John Doe';
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    id="editor__navbar-share-button"
                    variant={"outline"} className="!h-8" aria-label="Share">
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

                    {!isTemplate ? (
                        <>
                            <div className="mt-10">
                                <h3 className="text-sm font-medium mb-2">Who can view?</h3>
                                <Select value={viewAccess} onValueChange={(value) => setViewAccess(value as Access)}>
                                    <SelectTrigger className="focus-visible:ring-transparent">
                                        <div className="flex text-muted-foreground text-xs items-center gap-2">
                                            {getSelectedOption(viewAccess)?.Icon()}
                                            {getSelectedOption(viewAccess)?.label}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="z-[950]">
                                        {shareOptions.map(({ label, Icon, action }) => (
                                            <SelectItem key={action} value={action} className="py-3">
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
                                <Select value={editAccess} onValueChange={(value) => setEditAccess(value as
                                    Exclude<Access, 'public'>
                                )}>
                                    <SelectTrigger className="focus-visible:ring-transparent">
                                        <div className="flex text-muted-foreground text-xs items-center gap-2">
                                            {getSelectedOption(editAccess)?.Icon()}
                                            {getSelectedOption(editAccess)?.label}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="z-[950]">
                                        {shareOptions.slice(1).map(({ label, Icon, action }) => (
                                            <SelectItem key={action} value={action} className="py-3">
                                                <div className="flex items-center gap-2 [&>svg]:size-3.5 text-xs">
                                                    <Icon />
                                                    {label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    ) : (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium mb-2">Canvas Preview</h3>
                            <img
                                src={canvasPreviewUrl ?? ''}
                                alt="Preview of the project canvas"
                                className="w-full max-w-md h-auto border rounded-md object-cover"
                            />

                            <div className="flex items-center gap-2 mt-3">
                                <Checkbox
                                    id="show-identity"
                                    checked={showIdentity}
                                    onCheckedChange={(checkedState) => {
                                        setShowIdentity(checkedState.valueOf() as boolean)
                                    }}
                                />
                                <label htmlFor="show-identity" className="text-xs text-muted-foreground">
                                    Show your identity publicly <span className="italic">(e.g., {userIdentity})</span>
                                </label>
                            </div>
                        </div>
                    )}
                    <div className="mt-5 mb-8 flex items-center justify-between">
                        <label htmlFor="make-template" className="text-sm font-medium">Make this a template</label>
                        <Switch id="make-template" checked={isTemplate} onCheckedChange={setIsTemplate} />
                    </div>
                    <div
                        className="flex justify-end w-full mt-4"
                    >
                        <Button
                            disabled={isPending}
                            onClick={updateProjectAccess}
                            className="min-w-[190px]">
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
