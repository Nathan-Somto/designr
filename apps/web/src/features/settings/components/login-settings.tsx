import { LINKS } from '#/constants/links'
import { fetchCallback } from '#/features/auth/utils'
import { useConfirm } from '#/hooks/useConfirm'
import { authClient } from '@designr/auth/client'
import { Button } from '@designr/ui/components/button'
import { Divider } from '@designr/ui/components/divider'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function LoginSettings() {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const handleAccountDeletion = async () => {
        await authClient.deleteUser({
            callbackURL: LINKS.HOME
        })
    }
    const {
        ConfirmDialog
    } = useConfirm({
        title: 'Delete your Account',
        message: 'you have reached the point of no return, if you click confirm your account will be gone forever, are you sure?',
        onConfirm: handleAccountDeletion,
        onOpenChange(value) {
            setOpenConfirm(value)
        },
        open: openConfirm
    })
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                ...fetchCallback({
                    setIsPending
                })
            }
        })
        router.push(LINKS.HOME)
    }
    return (
        <section className="space-y-6 px-2 py-6 w-[90%]">
            <h3 className='text-2xl font-semibold'>
                Login
            </h3>
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col  w-full">
                    <h4 className='text-lg mb-1.5 font-semibold'>Security</h4>
                    <p className="text-sm text-muted-foreground  mb-3 font-medium">
                        Sign out from your current session
                    </p>
                    <Button
                        disabled={isPending}
                        onClick={handleLogout}
                        variant={'outline'} className='max-w-[180px]'>
                        Sign out
                    </Button>
                </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col  w-full">
                    <h4 className='text-lg mb-1.5 font-semibold'>Delete Account</h4>
                    <p className="text-sm text-muted-foreground  mb-3 font-medium">
                        This is an irreverisible action, all your data will be removed from our database
                    </p>
                    <Button
                        onClick={() => setOpenConfirm(true)}
                        variant={'destructive'}
                        className='max-w-[180px] brightness-90'>
                        Delete Account
                    </Button>
                </div>
            </div>
            <ConfirmDialog />
        </section>
    )
}
