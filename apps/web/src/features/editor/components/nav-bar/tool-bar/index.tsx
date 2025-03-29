import React from 'react'
import { Menubar, MenubarMenu, MenubarSeparator } from '@designr/ui/components/menubar'
import ActionMenu from './action-menu'
import { Button } from '@designr/ui/components/button'
import { CloudOffIcon, CloudUploadIcon, LoaderCircleIcon, MousePointer2, RedoIcon, UndoIcon } from 'lucide-react'
import ShapeMenu from './shape-menu'
import TextMenu from './text-menu'
import Hint from '@designr/ui/components/hint'
import ImageMenu from './image-menu'
export default function Toolbar() {
    const isPending = false;
    const isError = false;
    return (
        <Menubar>
            <MenubarMenu>
                {/* Action Menu e.g new file, back to dashboard, load template report an issue */}
                <ActionMenu />
                {/* Divider */}
                <MenubarSeparator
                />
                {/* Selection Button */}
                <Hint label='select'>
                    <Button
                        variant={'selection'}
                        size={'shrink'}>
                        <MousePointer2 />
                    </Button>
                </Hint>
                {/* Shape Menu */}
                <ShapeMenu />
                {/* Text Menu */}
                <TextMenu />
                {/* Image Menu */}
                <ImageMenu />
                {/* Undo */}
                <Hint label='undo'>
                    <Button
                        variant={'selection'}
                        size={'shrink'}
                        disabled
                    >
                        <UndoIcon />
                    </Button>
                </Hint>
                {/* Redo */}
                <Hint label='redo'>
                    <Button
                        variant={'selection'}
                        size={'shrink'}>
                        <RedoIcon />
                    </Button>
                </Hint>
                {/* Divider */}
                <MenubarSeparator />
                {/* Saving Indicator */}
                <div className='px-3'>
                    {isPending && (
                        <div className="flex items-center gap-x-2">
                            <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">
                                Saving...
                            </div>
                        </div>
                    )}
                    {!isPending && isError && (
                        <div className="flex items-center gap-x-2">
                            <CloudOffIcon className="size-4 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">
                                Failed to save
                            </div>
                        </div>
                    )}
                    {!isPending && !isError && (
                        <div className="flex items-center gap-x-2">
                            <CloudUploadIcon className="size-4 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">
                                Saved
                            </div>
                        </div>
                    )}
                </div>
            </MenubarMenu>
        </Menubar>
    )
}
