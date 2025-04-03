import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu'
import { shapes } from '../data'
import React from 'react'
import Hint from '@designr/ui/components/hint'
import { BaseEditorCompProps } from '#/features/editor/types'
type Action = typeof shapes[number]['action']
export default function ShapeMenu({
    editor
}: BaseEditorCompProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const {
        Icon,
        action
    } = shapes[currentIndex]

    const handleAction = (
        props: {
            action: Action
            index: number
        }
    ) => {
        document.body.style.cursor = 'default';
        editor?.disableDrawingMode();
        switch (props.action) {
            case 'Circle':
                editor?.addCircle()
                break;
            case 'Rectangle':
                editor?.addRectangle()
                break;
            case 'Triangle':
                editor?.addTriangle()
                break;
            case 'Line':
                document.body.style.cursor = 'crosshair';
                editor?.enableLineDrawingMode?.();
                break;
            case 'Diamond':
                editor?.addDiamond()
                break;
            case 'Drawing':
                editor?.enableDrawingMode()
                break;
            case 'Star':
                editor?.addStar()
                break;
            default:
                break;
        }
        editor?.setCurrentAction(props.action)
        setCurrentIndex(props.index)
    }
    return (
        <DropdownMenu>
            <Hint
                label={action}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'selection'}
                        className='font-medium'
                        size={'shrink'}
                        data-active={editor?.currentAction === action}
                    >
                        <Icon />
                    </Button>
                </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent
                sideOffset={8}
                className='max-w-44 mx-auto'
                align='end'
            >
                {shapes.map(({
                    Icon,
                    action
                }, index) => (
                    <DropdownMenuItem asChild key={action}>
                        <Button
                            variant={'selection'}
                            data-active={editor?.currentAction === action}
                            className='w-full justify-start text-xs font-medium'
                            onClick={() => handleAction({
                                action,
                                index
                            })}
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
    )
}
