import { Menubar, MenubarMenu } from '@designr/ui/components/menubar'
import { Button } from '@designr/ui/components/button'
import { PenIcon, CheckIcon } from 'lucide-react'
import React from 'react'
type Props = {
    filename?: string
}
export default function FilenameBar({
    filename
}: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const handleFilenameUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        //! use form data to update the filename
        setIsEditing(false)
        const formData = new FormData(e.target as HTMLFormElement)
        const filename = formData.get('filename') as string
        console.log(filename)
        //! calls the action to update the filename
    }
    return (
        <Menubar>
            <MenubarMenu>
                {isEditing ? (
                    <form
                        onSubmit={handleFilenameUpdate}
                        className='flex items-center gap-x-2'
                    >
                        <input
                            type='text'
                            name='filename'
                            defaultValue={filename}
                            className='text-xs font-medium h-8 px-2 outline-none rounded-[0.25rem] focus-visible:border focus-within:border focus-within:border-background focus-visible:border-background'
                        />
                        <Button
                            variant='ghost'
                            size='shrink'
                            type='submit'
                        >
                            <CheckIcon />
                        </Button>
                    </form>
                ) : (
                    <Button
                        variant='ghost'
                        size='shrink'
                        onClick={() => setIsEditing(true)}
                    >
                        <PenIcon />
                        <span className='text-xs font-medium'>
                            {filename}
                        </span>
                    </Button>
                )}
            </MenubarMenu>
        </Menubar>
    )
}
