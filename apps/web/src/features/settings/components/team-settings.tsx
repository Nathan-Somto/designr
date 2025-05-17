'use client';

import ErrorToast from '#/features/auth/components/error-toast';
import { Session } from '@designr/auth';
import { ActiveOrganization, authClient } from '@designr/auth/client';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@designr/ui/components/avatar';
import { Button } from '@designr/ui/components/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@designr/ui/components/dialog';
import { Input } from '@designr/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@designr/ui/components/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@designr/ui/components/table';
import { Loader, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
    session: Session | null;
};

export default function TeamSettings({ session }: Props) {
    const { isPending, data, error } = authClient.useActiveOrganization();
    const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"member" | "admin" | "owner">("member");
    const [loading, setLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null)
    const currentMember = optimisticOrg?.members.find(
        (member) => member.userId === session?.user?.id,
    );
    const inviteTeamMember = async () => {
        authClient.organization.inviteMember({
            email,
            role,
            fetchOptions: {
                throw: true,
                onSuccess: (ctx) => {
                    if (optimisticOrg) {
                        setOptimisticOrg({
                            ...optimisticOrg,
                            invitations: [
                                ...(optimisticOrg?.invitations || []),
                                ctx.data,
                            ],
                        });
                    }
                    setIsDialogOpen(false);
                },
                onError: (ctx) => {
                    console.log("i am getting called")
                    setInviteError(ctx.error.message)
                },
                onRequest() {
                    setLoading(true);
                },
                onResponse() {
                    setLoading(false);
                }
            },

        });

    }
    useEffect(() => {
        if (data) {
            setOptimisticOrg(data as ActiveOrganization);
        }
    }, [data]);

    if (isPending) {
        return (
            <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4">
            <ErrorToast error={error?.message ?? null} />
            <h2 className="text-2xl font-semibold">Team Members</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Member</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {optimisticOrg?.members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={member.user.image || undefined}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{member.user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{member.user.email}</TableCell>
                            <TableCell className="text-sm">{member.role}</TableCell>
                            <TableCell className="text-right">
                                {member.role !== 'owner' &&
                                    (currentMember?.role === 'owner' ||
                                        currentMember?.role === 'admin') && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                authClient.organization.removeMember({
                                                    memberIdOrEmail: member.id,
                                                })
                                            }
                                        >
                                            {currentMember?.id === member.id ? 'Leave' : 'Remove'}
                                        </Button>
                                    )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {!optimisticOrg?.id && session?.user && (
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={session.user.image || undefined} />
                                        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{session.user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{session.user.email}</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {
                (optimisticOrg?.name !== undefined) && (optimisticOrg?.name !== 'Personal') && (
                    <div className="pt-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-neutral-300 bg-transparent hover:bg-muted/40"
                                >
                                    <div className="rounded-full border border-neutral-300 p-1">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    Invite People
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <ErrorToast error={inviteError} />
                                <h3 className="text-lg font-semibold">Invite Team Members</h3>
                                {/* Add your invite form or logic here */}
                                <div className="flex flex-col gap-2">
                                    <label>Email</label>
                                    <Input
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label>Role</label>
                                    <Select
                                        value={role}
                                        onValueChange={(value) => setRole(value as "member" | "admin" | "owner")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className='z-[999999999999]'>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button
                                        disabled={loading}
                                        onClick={inviteTeamMember}
                                    >
                                        {loading ? 'Inviting...' : 'Invite'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        </div>
    );
}
