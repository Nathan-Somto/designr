'use client';


import { authClient } from '@designr/auth/client';
import { Button } from '@designr/ui/components/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@designr/ui/components/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@designr/ui/components/avatar';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getInvitations } from '#/services/invitations';
import Hint from '@designr/ui/components/hint';
import { Divider } from '@designr/ui/components/divider';
import { ScrollArea } from '@designr/ui/components/scroll-area';

export function NotificationPopover({ children }: React.PropsWithChildren) {
    const [page, setPage] = useState(1);
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const loadInvites = async () => {
        setLoading(true);
        const result = await getInvitations(page);
        console.log("invites result: ", result);
        setInvites((prev) => [...prev, ...result]);
        setDone(result.length < 20);
        setLoading(false);
    };
    const handleAcceptAll = async () => {
        try {

            await Promise.all(
                invites.map((invite) =>
                    authClient.organization.acceptInvitation({
                        invitationId: invite.id,
                    })
                )
            );
        }
        catch (err) {
            console.log("insert toast message")
        }
    };
    useEffect(() => {
        loadInvites();
    }, [page]);

    const accept = async (invitationId: string) => {
        await authClient.organization.acceptInvitation({ invitationId });
        setInvites((prev) => prev.filter((inv) => inv.id !== invitationId));
    };

    return (
        <Popover>
            <Hint
                label='Notifications'
                side='bottom'
            >

                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
            </Hint>
            <PopoverContent
                className="w-80 !px-0 !pt-0"
                style={{ height: 'max(70vh, 420px)' }}
            >
                <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="text-lg font-semibold">Invitations</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={invites.length === 0 || loading}
                        onClick={handleAcceptAll}
                    >
                        Accept All
                    </Button>
                </div>
                <Divider className="mb-3" />
                <ScrollArea
                    className="flex-1 h-[calc(100%-64px)]"
                >
                    <div className="space-y-4 h-full">
                        {invites.length === 0 && !loading && (
                            <div className="text-center h-full grid place-items-center text-muted-foreground text-sm py-4">
                                <p>No invitations yet</p>
                            </div>
                        )}

                        {invites.map((invite) => (
                            <div key={invite.id} className="flex items-center px-2 hover:bg-gray-300/50 py-2 w-[calc(100%-2*0.25rem)] mx-auto rounded-lg justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8">
                                        <AvatarImage src={invite.orgLogo || ''} />
                                        <AvatarFallback>
                                            {invite.orgName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{invite.orgName}</span>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => accept(invite.id)}
                                >
                                    Accept
                                </Button>
                            </div>
                        ))}

                        {!done && !loading && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Load more
                            </Button>
                        )}
                        {loading && (
                            <div className="flex justify-center py-2">
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
