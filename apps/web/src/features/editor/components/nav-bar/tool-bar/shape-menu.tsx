import { Button } from '@designr/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@designr/ui/components/dropdown-menu'
import { shapes } from '../data'
import React from 'react'
import Hint from '@designr/ui/components/hint'
type Action = typeof shapes[number]['action']
export default function ShapeMenu() {
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
        switch (props.action) {
            case 'Circle':
                break;
            case 'Rectangle':
                break;
            case 'Triangle':
                break;
            case 'Line':
                break;
            case 'Diamond':
                break;
            case 'Drawing':
                break;
            case 'Star':
                break;
            default:
                break;
        }
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
                            data-active={currentIndex === index}
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
