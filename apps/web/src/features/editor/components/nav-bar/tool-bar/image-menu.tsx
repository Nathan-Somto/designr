import { useFilePicker } from '#/hooks/useFilePicker'
import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu'
import Hint from '@designr/ui/components/hint'
import { image } from '../data'
import React from 'react'
import { AssetsDialog } from '../../dialogs/assets-dialog'
import { useEditorStore } from '#/features/editor/hooks/useEditorStore'
type Action = typeof image.options[number]['action']
export default function ImageMenu() {
    const { editor } = useEditorStore();
    const [defaultTab, setDefaultTab] = React.useState<'uploaded' | 'unsplash' | 'icons'>('uploaded')
    const [open, setOpen] = React.useState(false)
    const {
        Icon,
        action
    } = image
    const {
        InputElement,
        onFilePickerClick: onImagePickerClick,
    } = useFilePicker({
        onGetFile: (image) => {
            console.log("the data url: ", image)
            //! call the image upload action
            //! update the asset modal state
            //! put the image in the canvas
        },
        acceptedTypes: ['jpg', 'jpeg', 'png', 'svg'],
    })
    const handleAddImageToCanvas = (image: string, url: 'svg' | 'url') => {
        console.log("the image to add to canvas: ", image)
        //! put the image in the canvas
        if (url === 'svg') {
            editor?.addSvgString(image)
            return
        }
        editor?.addImage(image)
    }
    const handleImageAction = (action: Action) => {
        switch (action) {
            case 'Upload':
                onImagePickerClick();
                break;
            case 'Unsplash':
                //! open the asset modal and set the tab to unsplash
                setOpen(true);
                setDefaultTab('unsplash');
                break;
            case 'Select':
                //! open the asset modal and set the tab to select
                setOpen(true);
                setDefaultTab('uploaded');
                break;
            case 'Icons':
                //! open the asset modal and set the tab to icons
                setOpen(true);
                setDefaultTab('icons');
                break;
            default:
                break;
        }
    }
    return (
        <>
            <DropdownMenu>
                <Hint label={action}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={'selection'}
                            className='font-medium'
                            size='shrink'
                        >
                            <Icon />
                        </Button>
                    </DropdownMenuTrigger>
                </Hint>
                <DropdownMenuContent
                    sideOffset={8}
                    align='end'
                    className='z-[65]'
                >
                    {image.options.map(({
                        Icon,
                        action
                    }) => (
                        <DropdownMenuItem
                            asChild
                            key={action}
                            onClick={() => handleImageAction(action)}
                        >
                            <Button
                                variant={'selection'}
                                className='w-full justify-start text-xs font-medium'
                            >
                                <Icon />
                                <span>
                                    {action}
                                </span>
                            </Button>
                        </DropdownMenuItem>
                    ))}

                </DropdownMenuContent>
            </DropdownMenu>
            <InputElement />
            <AssetsDialog
                defaultTab={defaultTab}
                openProp={open}
                onOpenChange={setOpen}
                onSelect={(image, url) => {
                    if (image) handleAddImageToCanvas(image, url)
                    setOpen(false)
                }}
            />
        </>
    )
}
