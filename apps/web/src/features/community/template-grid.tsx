/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "motion/react";
import {
    Pencil,
    UserIcon,
    StarIcon,
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
import { useMemo, useState } from "react";
import ProBadge from "./pro-badge";
import { TemplateCard } from "./template-card";
import { cn } from "@designr/ui/lib/utils";

const PreviewDialog = ({
    open,
    onOpenChange,
    template
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    template: (typeof templates)[0];
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img
                    src={template.image}
                    alt="Preview"
                    className="rounded-md w-full object-cover"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {template.name}
                                {template.isPro && <ProBadge />}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={template.createdBy?.image} />
                                <AvatarFallback>
                                    <UserIcon className="size-3.5" />
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                                {template.createdBy?.name || "Anonymous"}
                            </span>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button>
                            <Pencil className="size-4 mr-2" />
                            Open in Editor
                        </Button>
                        <Button variant="outline">
                            <StarIcon className="size-4" fill={template.isStarred ? "text-yellow-500" : "none"} />
                            Star Template
                        </Button>
                    </DialogFooter>
                </div>
            </div>
        </DialogContent>
    </Dialog>
);

const templates = [
    {
        id: "1",
        name: "Modern Portfolio",
        image: "https://placehold.co/800x600",
        createdBy: { name: "Elanathan", image: "/user.jpg" },
        isPro: true,
        isStarred: false
    },
    {
        id: "2",
        name: "Minimal Resume",
        image: "https://placehold.co/750x600",
        createdBy: null,
        isPro: false,
        isStarred: true
    },
    {
        id: "3",
        name: "Creative Agency",
        image: "https://placehold.co/700x700",
        createdBy: { name: "Cynthia Doe", image: "/user2.jpg" },
        isPro: true,
        isStarred: true
    },
    {
        id: "4",
        name: "Freelancer Kit",
        image: "https://placehold.co/800x500",
        createdBy: null,
        isPro: false,
        isStarred: false
    },
    {
        id: "5",
        name: "E-commerce Launch",
        image: "https://placehold.co/800x640",
        createdBy: { name: "Dev Boss", image: "/user3.jpg" },
        isPro: true,
        isStarred: false
    }
];

export default function TemplateGrid() {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null);

    const handlePreview = (template: (typeof templates)[0]) => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
    };

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
                            template={template}
                            onPreview={() => handlePreview(template)}
                            handleEditorOpen={(id) =>
                                new Promise((resolve) => {
                                    resolve(console.log(id));
                                })
                            }
                        />
                    </motion.div>
                ))}

            </div>

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
