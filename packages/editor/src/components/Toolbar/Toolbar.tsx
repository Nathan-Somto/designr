import * as fabric from 'fabric'
import { useCanvas } from '@/hooks/useCanvas'
import { Action, options1 } from './data'
import ShapeMenu from './ShapeMenu'
import TextMenu from './TextMenu'
import ImageMenu from './ImageMenu'
import { useHistory } from '@/hooks/useHistory'
import ActionLabel from '@repo/ui/components/ui/hint'
import ExportMenu from './ExportMenu'
import { insertElement } from './utils'
import SettingsMenu from './SettingsMenu'

export default function Toolbar() {
    const { canvas, updateAction, currentAction } = useCanvas()
    const { canRedo, canUndo, redo, undo, pointer, history } = useHistory();

    console.log("the pointer:", pointer)
    const handleAction = (action: Action) => {
        if (!canvas) return
        switch (action) {
            case 'Select': {
                if (canvas.isDrawingMode) {
                    canvas.isDrawingMode = false;
                }
                break;
            }
            case 'Rectangle': {
                const rect = new fabric.Rect({
                    width: 100,
                    height: 100,
                    stroke: 'black',
                    fill: 'black',
                })
                insertElement(canvas, rect)
                break
            }
            case 'Circle': {
                const circle = new fabric.Circle({
                    radius: 50,
                    stroke: 'black',
                    fill: 'black',
                })
                insertElement(canvas, circle)
                break
            }
            case 'Triangle': {
                const triangle = new fabric.Triangle({
                    width: 100,
                    height: 100,
                    stroke: 'black',
                    fill: 'black',
                })
                insertElement(canvas, triangle)
                break
            }
            case 'Diamond': {
                const polygon = new fabric.Rect(
                    {
                        width: 100,
                        height: 100,
                        angle: 45,
                        stroke: 'black',
                        fill: 'black',
                    }
                )
                insertElement(canvas, polygon)
                break
            }
            case 'Clear': {
                const activeObjects = canvas.getActiveObjects();
                activeObjects.forEach(object => {
                    canvas.remove(object)
                })
                canvas.discardActiveObject()
                updateAction('Select')
                return
            }
            case "Drawing": {

                //canvas.isDrawingMode = true;
                canvas.set('isDrawingMode', true);
                canvas.set('freeDrawingBrush', new fabric.PencilBrush(canvas));
                const brush = canvas.freeDrawingBrush;
                if (brush) {
                    brush.color = 'red';
                    brush.width = 10;
                }
                console.log("Drawing mode enabled")
                canvas.renderAll()
                break
            }
            case 'Star': {
                // create a star using a polygon
                const star = new fabric.Polygon(
                    [
                        { x: 50, y: 2 },
                        { x: 55, y: 6 },
                        { x: 55, y: 20 },
                        { x: 35, y: 20 },
                        { x: 35, y: 6 },
                        { x: 50, y: 2 },
                    ],
                    {
                        stroke: 'black',
                        fill: 'black',
                    }
                )
                insertElement(canvas, star)
                break
            }
            default:
                break
        }
        updateAction(action)
    }
    const handleRedoUndo = (action: 'Undo' | 'Redo') => {
        if (!canvas) return;
        if (action === 'Undo') {
            undo(canvas)
        }
        else {
            redo(canvas)
        }
    }
    const isActiveAction = (action: Action | undefined) => {
        if (action === 'Clear') return false;
        if (currentAction === action && action !== 'Select') return true
        if (action === 'Select' && (currentAction === 'Selection' || currentAction === 'Rotating' || currentAction === 'Translating' || currentAction === 'Select')) return true
        return false
    }
    console.log("current history in toolbar:", history)
    return (
        <div className="fixed top-0 h-16 left-0 text-panel-foreground right-0 px-8 mx-auto flex w-full items-center justify-between gap-2  bg-panel p-2 shadow-md z-50 transition duration-300">
            <div>
                <h2 className="text-lg font-semibold " style={{
                    fontStyle: 'italic',
                }}>Designr</h2>
            </div>
            <div className='flex flex-[0.7] justify-center items-center gap-2'>
                {options1.slice(0, 1).map(({ Icon, action }, index) => (
                    <button
                        key={index}
                        className={`flex h-10 w-10 items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction(action) ? 'bg-blue-200 scale-110 text-white' : 'text-black'}`}
                        onClick={() => handleAction(action)}
                    >
                        <Icon />
                    </button>
                ))}

                <ShapeMenu
                    currentAction={currentAction}
                    isActiveAction={isActiveAction}
                    handleAction={handleAction}
                />
                <TextMenu isActiveAction={isActiveAction} />
                <ImageMenu isActiveAction={isActiveAction} />
                {options1.slice(1, 3).map(({ Icon, action }, index) => {
                    return <ActionLabel label={action}>
                        <button
                            key={index}
                            disabled={(action === 'Undo' && !canUndo()) || (action === 'Redo' && !canRedo())}
                            className={`flex h-10 w-10 disabled:!opacity-50 disabled:cursor-not-allowed items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction(action) ? 'bg-blue-200 scale-110 text-white' : action === 'Clear' ? 'text-destructive hover:text-black' : 'text-black'}`}
                            onClick={() => handleRedoUndo(action as 'Undo' | 'Redo')}
                        >
                            <Icon />
                        </button>
                    </ActionLabel>
                })}
                {options1.slice(3).map(({ Icon, action }, index) => (
                    <ActionLabel label={action}>
                        <button
                            key={index}
                            className={`flex h-10 w-10 disabled:opacity-50 items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction(action) ? 'bg-blue-200 scale-110 text-white' : action === 'Clear' ? 'text-destructive hover:text-black' : 'text-black'}`}
                            onClick={() => handleAction(action)}
                        >
                            <Icon />
                        </button>
                    </ActionLabel>
                ))}
            </div>
            <div className='flex gap-x-2 items-center'>
                <ExportMenu />
                <SettingsMenu />
            </div>
        </div>
    )
}
