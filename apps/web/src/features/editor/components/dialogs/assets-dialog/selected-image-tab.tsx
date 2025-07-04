/* eslint-disable no-unused-vars */
import { ProButton, UpgradeToProButton } from '#/components/sidebar/pro-status'
import { authClient } from '@designr/auth/client'
import { Button } from '@designr/ui/components/button'
import { ChevronLeftIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
interface Props {
    selectedImage: string | null
    onSelect: (image: string | null) => void
    onTransform: () => void
    onBack: () => void
}
export default function SelectedImageTab({ onSelect, onTransform, selectedImage, onBack }: Props) {
    const { data, isPending: isCheckingUserSession } = authClient.useSession();
    return (
        <section
            id="editor__selected-image-tab"
            className="flex flex-col px-5  h-full space-y-4">
            <div className="flex items-center gap-x-2 mb-1">
                <Button
                    variant="ghost"
                    size={'icon'}
                    className='!px-0 !w-[24px] !h-fit'
                    onClick={() => {
                        onBack()
                    }}
                >
                    <ChevronLeftIcon className="!size-[20px]" />
                </Button>
                <span className="text-lg font-bold">Selected Image</span>
            </div>
            <p className="text-sm text-muted-foreground">You can use this image as is or transform it.</p>
            <figure className="w-full h-48 relative rounded-md overflow-hidden">
                {selectedImage ? (
                    <Image
                        alt="selected-image"
                        src={selectedImage}
                        fill
                        className="object-cover w-full h-full" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No image selected
                    </div>
                )}
            </figure>
            <div className="flex gap-4 w-full !mt-5">
                <Button
                    className='flex-1'
                    onClick={() => {
                        onSelect(selectedImage)
                    }}
                >Use as is</Button>
                <div className='relative flex-1'>
                    <UpgradeToProButton
                        type="overlay"
                        show={!data?.user?.isPro}
                        isChecking={isCheckingUserSession}
                    />
                    <Button variant="outline"
                        className='flex-1'
                        onClick={() => {
                            onTransform()
                        }}
                    >Transform</Button>
                </div>
            </div>
        </section>
    )
}
