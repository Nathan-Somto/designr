/* eslint-disable @next/next/no-img-element */
import { authClient } from "@designr/auth/client";
import { Button } from "@designr/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@designr/ui/components/dialog";
import { Input } from "@designr/ui/components/input";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import React from "react";
import { z } from "zod";
import ErrorToast from "./error-toast";
import { fetchCallback } from "../utils";
import { v4 } from "uuid";
const urlSchema = z.string().url();
type Props = {
    onCreate: (organization: {
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        metadata?: any;
        logo?: string | null | undefined;
    }) => void;
}
export default function CreateOrganizationDialog({ onCreate }: Props) {
    const [name, setName] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [isSlugEdited, setIsSlugEdited] = React.useState(false);
    const [logo, setLogo] = React.useState<string | null>(null);
    const [validLogo, setValidLogo] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null)
    React.useEffect(() => {
        if (!isSlugEdited) {
            const generatedSlug = name.trim().toLowerCase().replace(/\s+/g, "-");
            setSlug(generatedSlug);
        }
    }, [name, isSlugEdited]);
    React.useEffect(() => {
        if (!logo) {
            setValidLogo(false);
            return;
        }

        const isValid = urlSchema.safeParse(logo).success;
        setValidLogo(isValid);
    }, [logo]);
    const reset = () => {
        setName('')
        setSlug('')
        setLogo('')
        setValidLogo(false)
    }
    React.useEffect(() => {
        if (open) {
            setName("");
            setSlug("");
            setIsSlugEdited(false);
            setLogo(null);
        }
    }, [open]);



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="mt-2 px-5">
                <DialogTrigger asChild>

                    <Button
                        variant="ghost"
                        className="cursor-pointer text-sm w-full flex justify-start"
                    >
                        <PlusCircleIcon className="mr-1.5 size-7" />
                        Create an Organization
                    </Button>
                </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-[425px] mx-auto w-11/12">
                <ErrorToast error={error} />
                <DialogHeader>
                    <DialogTitle>New Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Organization Name</label>
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Organization Slug</label>
                        <Input
                            value={slug}
                            onChange={(e) => {
                                setSlug(e.target.value);
                                setIsSlugEdited(true);
                            }}
                            placeholder="Slug"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Logo</label>
                        <Input
                            placeholder="Logo url"
                            onChange={(e) => {
                                setLogo(e.target.value)
                            }} />
                        {validLogo && logo && (
                            <div className="mt-2">
                                <img
                                    src={logo}
                                    alt="Logo preview"
                                    className="w-16 h-16 object-cover"
                                    width={16}
                                    height={16}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            const organization = await authClient.organization.create(
                                {
                                    name: name,
                                    slug: slug,
                                    logo: logo || undefined,
                                },
                                fetchCallback({
                                    setIsPending: setLoading,
                                    setError
                                })
                            );
                            onCreate({
                                createdAt: organization.data?.createdAt ?? new Date(),
                                id: organization.data?.id ?? v4(),
                                name: organization.data?.name ?? 'No Organization',
                                slug: organization.data?.slug ?? 'No slug',
                                logo: organization.data?.logo,
                                metadata: organization.data?.metadata
                            })
                            reset()
                            setOpen(false);
                        }}
                    >
                        {loading ? (
                            <Loader2Icon className="animate-spin" size={16} />
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}