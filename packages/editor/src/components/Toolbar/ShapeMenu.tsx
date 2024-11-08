
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent } from '@repo/ui/components/ui/dropdown-menu'
import { CanvasAction } from '../../hooks/useCanvas';
import { shapes } from './data';
import { MenuProps } from './types';
import ActionLabel from '@repo/ui/components/ui/hint';
export default function ShapeMenu({ currentAction, isActiveAction, handleAction }: MenuProps) {
    const getSelectedShape = (action: CanvasAction) => {
        const shape = shapes.find(({ action: shapeAction }) => shapeAction === action);
        return shape
    }
    const selectedShape = getSelectedShape(currentAction)
    return (
        <DropdownMenu>
            <ActionLabel label='Shapes'>
            <DropdownMenuTrigger className={`flex h-10 w-10 items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction(selectedShape?.action) ? 'bg-blue-200 scale-110 text-white' : 'text-black'}`}>
                {selectedShape?.Icon() || shapes[0].Icon()}
            </DropdownMenuTrigger>
            </ActionLabel>
            <DropdownMenuContent>
                {shapes.map(({ Icon, action }) => (
                    <DropdownMenuItem
                        key={action}
                        onClick={() => handleAction(action)}
                        className=''>
                        <Icon />
                        {action}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
