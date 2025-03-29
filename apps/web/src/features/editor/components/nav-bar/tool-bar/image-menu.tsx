import { useImagePicker } from '#/hooks/useImagePicker'
import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu'
import Hint from '@designr/ui/components/hint'
import { image } from '../data'
import React from 'react'
type Action = typeof image.options[number]['action']
export default function ImageMenu() {
    const {
        Icon,
        action
    } = image
    const {
        InputElement,
        onImagePickerClick,
    } = useImagePicker({
        onGetImage: (image) => {
            console.log("the data url: ", image)
            //! call the image upload action
            //! update the asset modal state
            //! put the image in the canvas
        }
    })
    const handleImageAction = (action: Action) => {
        switch (action) {
            case 'Upload':
                onImagePickerClick();
                break;
            case 'Unsplash':
                //! open the asset modal and set the tab to unsplash
                break;
            case 'Select':
                //! open the asset modal and set the tab to select
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
        </>
    )
}
