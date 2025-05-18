/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "motion/react";
import {
    Pencil,
    UserIcon,
    StarIcon,
    Loader,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@designr/ui/components/dialog";
import { Button } from "@designr/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@designr/ui/components/avatar";
import { useEffect, useMemo, useState, useTransition } from "react";
import ProBadge from "./pro-badge";
import { TemplateCard } from "./template-card";
import { cn } from "@designr/ui/lib/utils";
import { CommunityProjectsData, useProjects } from "#/hooks/useProjects";
import { useStarTemplate } from "#/hooks/useStarTemplate";
import { useSettings } from "../settings/settings-provider";
import { useRouter } from 'next/navigation'
import { createProjectFromTemplate } from "#/services/projects";
import { LINKS } from "#/constants/links";
const PreviewDialog = ({
    open,
    onOpenChange,
    template
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    template: CommunityProjectsData;
}) => {
    const {
        settings
    } = useSettings();
    const [isCreatingProject, startTransition] = useTransition()
    const router = useRouter();
    const handleProjectCreation = async () => {
        startTransition(async () => {
            const res = await createProjectFromTemplate(template.id)
            startTransition(() => {
                const projectUrl = `${LINKS.EDITOR}/${res.organizationId}/${res.id}`
                if (settings?.openDesignsInNewTab) {
                    window.open(projectUrl, '_blank')
                }
                else {
                    router.push(projectUrl)
                }
                onOpenChange(false)
            })
        })
    }
    const {
        starTemplate,
        isPending
    } = useStarTemplate();
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}

        >
            <DialogContent className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <img
                        src={template.image ?? ''}
                        alt="Preview"
                        className="rounded-md w-full object-cover"
                    />
                    <div className="flex flex-col justify-between">
                        <div>
                            <DialogHeader>
                                <DialogTitle className="flex leading-9 items-center gap-2">
                                    {template.name}
                                    {template.isPro && <ProBadge />}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={template.createdBy?.image ?? ''} />
                                    <AvatarFallback>
                                        <UserIcon className="size-3.5" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">
                                    {template.createdBy?.name || "Anonymous"}
                                </span>
                            </div>
                        </div>
                        <DialogFooter className="mt-6 !justify-start">
                            <Button
                                disabled={isCreatingProject || isPending}
                                onClick={handleProjectCreation}
                            >
                                <Pencil className="size-4 mr-2" />
                                {isCreatingProject ? 'Creating...' : 'Open in Editor'}
                            </Button>
                            <Button
                                variant={template.isStarred ? 'ghost' : 'outline'}
                                disabled={isPending || isCreatingProject}
                                className={`${template.isStarred ? "!text-muted-foreground/70" : ""}`}
                                onClick={async () => await starTemplate(template.id, template.isStarred, 'community')}
                            >
                                <StarIcon className={`size-4 ${template.isStarred ? "!fill-yellow-500 !text-yellow-500" : ""}`} />
                                {!template.isStarred ? 'Star Template' : 'Starred'}
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};


type Props = {
    data: CommunityProjectsData[]
}
export default function TemplateGrid({ data }: Props) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<CommunityProjectsData | null>(null);
    const {
        setSlice,
        state: {
            community: {
                data: realData,
                filteredData: filteredData
            }
        },
    } = useProjects();

    useEffect(() => {
        setSlice({
            slice: 'community',
            data,
            mode: 'replace',
        })
        setLoading(false)
    }, [data])
    const handlePreview = (template: CommunityProjectsData) => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
    };
    const templates = filteredData ?? realData;
    const isFiltered = filteredData !== undefined
    const layoutClasses = useMemo(() => {
        return templates.map((_, index) => {
            switch (index % 6) {
                case 0:
                    return "col-span-2 row-span-2";
                case 1:
                    return "col-span-1 row-span-2";
                case 2:
                    return "col-span-1 row-span-2";
                case 3:
                    return "col-span-2 row-span-2";
                case 4:
                    return "col-span-1 row-span-2";
                default:
                    return "col-span-1 row-span-2";
            }
        });
    }, []);

    return (
        <section
            id="community__templates-grid"
            className="mt-6"
        >
            <motion.h3
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    delay: 0.34,
                    duration: 0.234
                }}
                className="font-semibold text-lg">Start your Journery</motion.h3>
            {
                loading ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                        <Loader className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (

                    templates.length === 0 ? (
                        <>
                            {
                                <p className="text-center h-full grid place-items-center text-muted-foreground text-sm py-4">
                                    {
                                        isFiltered ? 'no template matches the filter' : 'no templates available'
                                    }
                                </p>
                            }
                        </>
                    ) : (
                        <div className="grid gap-5 pb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4  mt-4">
                            {templates.map((template, index) => (
                                <motion.div
                                    key={template.id}
                                    className={cn("relative", layoutClasses[index])}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                                >
                                    <TemplateCard
                                        template={{
                                            id: template.id,
                                            image: template.image ?? '',
                                            isStarred: template.isStarred,
                                            name: template.name,
                                            isPro: template.isPro
                                        }}
                                        onPreview={() => handlePreview(template)}
                                    />
                                </motion.div>
                            ))}

                        </div>
                    )

                )
            }

            {selectedTemplate && (
                <PreviewDialog
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    template={selectedTemplate}
                />
            )}
        </section>
    );
}
