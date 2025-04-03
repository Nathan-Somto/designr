import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent } from '@repo/ui/components/dropdown-menu'
import { useCanvas } from '../../hooks/useCanvas';
import { Config, text } from './data';
import * as fabric from 'fabric'
import { MenuProps } from './types';
import { insertElement, randomPosition } from './utils';
import ActionLabel from '@repo/ui/components/hint';

export default function TextMenu({ isActiveAction }: Pick<MenuProps, 'isActiveAction'>) {
    const { canvas, updateAction } = useCanvas()
    const handleTextAction = (value: string, config: Omit<Config, 'value'>) => {
        if (!canvas) return
        const { top, left } = randomPosition(canvas.height, canvas.width);
        const text = new fabric.Textbox(value, {
            ...config,
            top,
            left
        })
        insertElement(canvas, text)
        updateAction('Text')
    }
    return (
        <DropdownMenu>
            <ActionLabel label='Text'>
                <DropdownMenuTrigger className={`flex h-10 w-10 items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction('Text') ? 'bg-blue-200 scale-110 text-white' : 'text-black'}`}>
                    {text['Icon']()}
                </DropdownMenuTrigger>
            </ActionLabel>
            <DropdownMenuContent>
                {text['options'].map(({ label, config: { value, ...rest } }) => (
                    <DropdownMenuItem
                        key={label}
                        style={rest}
                        onClick={() => handleTextAction(value, rest)}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
