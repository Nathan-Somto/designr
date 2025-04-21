"use client";

import { useEffect, useState } from "react";
import { Button } from "@designr/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@designr/ui/components/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@designr/ui/components/popover";
import { authClient, ActiveOrganization } from "@designr/auth/client";
import { useRouter } from "next/navigation";
import { LINKS } from "#/constants/links";
import { Divider } from "@designr/ui/components/divider";
import { CheckIcon, ChevronDownIcon, Loader2, UsersIcon } from "lucide-react";
import { ScrollArea } from "@designr/ui/components/scroll-area";
import CreateOrganizationDialog from "./create-organization-dialog";
type ElementType<T> = T extends (infer U)[] ? U : never;
export default function OrganizationSwitcher(props: {
    activeOrganization: ActiveOrganization | null;
}) {
    console.log("active organization", props.activeOrganization)
    const [activeOrganization, setActiveOrganization] = useState(props.activeOrganization)
    const { data: currentUser, } = authClient.useSession();
    const { data: organizationsData, isPending, error: organizationError } = authClient.useListOrganizations();
    const [open, setOpen] = useState(false);
    const [organizations, setOrganization] = useState<typeof organizationsData>(null);
    useEffect(() => {
        setOrganization(organizationsData)
    }, [organizationsData])
    const onCreateOrg = (org: NonNullable<ElementType<typeof organizationsData>>) => {
        setOrganization(prev => ([
            org,
            ...(prev ?? [])
        ]))
        setOpen(false);
        router.push(`${LINKS.DASHBOARD}/team/${org.id}`);
    }
    const router = useRouter();
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select an organization"
                        className="w-[200px] hover:text-foreground justify-between hover:bg-gray-300/50"
                    >
                        <Avatar className="mr-1.5 size-8 border border-primary">
                            <AvatarImage
                                src={currentUser?.user.image || undefined}
                                alt={currentUser?.user.name}
                            />
                            <AvatarFallback>{currentUser?.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="font-semibold text-xs line-clamp-1">{activeOrganization?.name ?? 'No Organization'}</p>
                            <p className="text-xs !text-muted-foreground line-clamp-1">{currentUser?.user.name}</p>
                        </div>
                        <ChevronDownIcon className="ml-auto self-end size-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[300px] !px-0 mr-7 rounded-[25px] overflow-hidden py-4"
                    style={{ height: 'max(70vh, 420px)' }}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center text-sm w-full px-5">
                            <Avatar className="mr-2 size-16 border border-primary">
                                <AvatarImage
                                    src={currentUser?.user.image || undefined}
                                    alt={currentUser?.user.name}
                                />
                                <AvatarFallback>
                                    {currentUser?.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 line-clamp-2">
                                <p className="font-semibold text-sm">
                                    {currentUser?.user.name}
                                </p>
                                <p className="text-muted-foreground line-clamp-1">{currentUser?.user.email}</p>
                            </div>
                        </div>

                        <Divider className="my-3" />

                        {/* Scrollable orgs section */}
                        <ScrollArea className="flex-1 h-[calc(100%-64px)]">
                            <h3 className="text-sm text-muted-foreground px-5">organizations</h3>

                            {organizationError && (
                                <p className="text-destructive text-sm text-center mt-2">failed to retrieve organizations</p>
                            )}

                            {isPending && (
                                <div className="flex flex-col items-center justify-center mt-3 px-5">
                                    <Loader2 className="animate-spin size-6" />
                                    <p className="text-sm text-muted-foreground">getting organization details</p>
                                </div>
                            )}

                            {organizations?.map((org) => (
                                <Button
                                    data-active={activeOrganization?.id === org.id}
                                    variant={'selection'}
                                    key={org.id}
                                    onClick={async () => {
                                        const optimisticOrg = await authClient.organization.setActive({
                                            organizationId: org.id,
                                        });
                                        const isPersonal = org.name === 'Personal';
                                        setActiveOrganization(optimisticOrg.data);
                                        setOpen(false);
                                        router.push(`${LINKS.DASHBOARD}/${isPersonal ? 'personal' : 'team'}/${org.id}`);
                                    }}
                                    className="text-sm flex rounded-[4px] w-[calc(100%-20px)] mx-auto mt-2"
                                >
                                    <Avatar className="mr-2 size-6">
                                        <AvatarImage src={org.logo || undefined} alt={org.name + ' logo'} />
                                        <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <p>{org.name}</p>
                                            {activeOrganization?.id == org.id && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <UsersIcon className="size-3" />
                                                    <span>{activeOrganization.members.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {activeOrganization?.id === org?.id && (
                                        <CheckIcon className="size-8 text-primary" />
                                    )}
                                </Button>
                            ))}

                        </ScrollArea>
                        <Divider className="my-3" />

                        {/* Bottom button */}
                        <CreateOrganizationDialog
                            onCreate={onCreateOrg}
                        />
                    </div>
                </PopoverContent>

            </Popover>
        </>
    );
}