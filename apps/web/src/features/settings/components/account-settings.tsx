/* eslint-disable @next/next/no-img-element */
"use client";
import { authClient } from '@designr/auth/client';
import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "@designr/ui/components/input";
import { Button } from "@designr/ui/components/button";
import { motion } from "framer-motion";
import { Divider } from '@designr/ui/components/divider';
import ErrorToast from '#/features/auth/components/error-toast';
import { Session } from '@designr/auth';
import { Loader } from 'lucide-react';


const urlSchema = z.string().url();
export default function AccountSettings({ session }: {
    session: Session | null
}) {


    const [name, setName] = useState(session?.user.name ?? '');
    const [editingName, setEditingName] = useState(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>(session?.user.image ?? "");
    const [tempUrl, setTempUrl] = useState<string>("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [validImage, setValidImage] = useState(false);
    const [error, setError] = useState<string | null>('')
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        setName(prev => session?.user.name ?? prev);
        setImageUrl(prev => session?.user.image ?? prev);
    }, [session])
    // debounce image url
    useEffect(() => {
        const timeout = setTimeout(() => {
            const result = urlSchema.safeParse(tempUrl);
            setValidImage(result.success);
            if (result.success) setImageUrl(tempUrl);
        }, 300);
        return () => clearTimeout(timeout);
    }, [tempUrl]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await authClient.updateUser({
                name,
                image: imageUrl,

            });
            if (currentPassword && newPassword) {
                await authClient.changePassword({
                    newPassword: newPassword,
                    currentPassword: currentPassword,
                });
            }
            setEditingName(false);
            setShowImageInput(false);
        }
        catch (err) {
            setError((err as Error).message)
        }
        finally {
            setSaving(false);
        }
    };
    if (session === null) {
        return (
            <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }
    return (
        <section className="space-y-6 py-6 w-[90%]">
            {/* Image section */}
            <ErrorToast error={error} />
            <h3 className='text-2xl font-medium'>
                Your Profile
            </h3>
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="image-url" className="text-sm font-medium">Profile Photo</label>
                    <div className="size-24 rounded-full overflow-hidden relative">
                        <img src={(validImage ? tempUrl : imageUrl) || undefined} alt="Profile" className="object-cover size-full" />
                    </div>

                </div>
                <div className="flex gap-2">
                    {imageUrl && (
                        <Button variant="ghost" size="sm" onClick={() => {
                            setImageUrl("");
                            setTempUrl("");
                            setValidImage(false);
                        }}>
                            Remove
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setShowImageInput((prev) => !prev)}>
                        Change
                    </Button>
                </div>
            </div>

            {showImageInput && (
                <Input
                    id="image-url"
                    placeholder="Enter image URL"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                />
            )}

            <Divider />

            {/* Name section */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                        id="name"
                        readOnly={!editingName}
                        value={name ?? 'no name'}
                        onChange={(e) => setName(e.target.value)}
                        className='text-muted-foreground mt-1 !shadow-none'
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingName((prev) => !prev)}
                    className='self-end'
                >
                    {editingName ? "Cancel" : "Edit"}
                </Button>
            </div>
            <Divider />
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input
                        id="email"
                        readOnly
                        value={session?.user.email ?? 'no email'}
                        onChange={(e) => setName(e.target.value)}
                        className='text-muted-foreground mt-1 !shadow-none'
                    />
                </div>

            </div>
            <Divider />
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                    <Input
                        id="currentPassword"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className='text-muted-foreground mt-1 !shadow-none'
                        placeholder='*****'
                    />
                </div>

            </div>
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                    <Input
                        id="newPassword"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='text-muted-foreground mt-1 !shadow-none'
                        placeholder='*****'
                    />
                </div>

            </div>
            {/* Save button when editing */}
            {(editingName || showImageInput || currentPassword !== '' || newPassword !== '') && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-10 right-8 -translate-x-1/2 z-50"
                >
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-10"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </motion.div>
            )}
        </section>
    );
}


