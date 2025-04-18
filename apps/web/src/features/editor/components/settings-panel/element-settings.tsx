import React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '@designr/ui/components/dropdown-menu'
import {
    EditorInput
} from '../ui/editor-input'
import {
    element as elementData
} from './data'
import { BaseEditorCompProps, EditorInputValue } from '../../types'
import { SelectedObject } from '@designr/use-editor'
interface Props extends BaseEditorCompProps {
    isGroup?: boolean
    elements: string | string[]
    thereIsACircle?: boolean
    thereIsARect?: boolean
    thereIsAText?: boolean
}
type ElementType = "width" | "height" | "x" | "y" | "angle" | "diameter" | "cornerSize";
export default function ElementSettings({
    editor,
    isGroup,
    elements,
    thereIsACircle,
    thereIsARect
}: Props) {
    const [elementState, setElementState] = React.useState<Record<
        ElementType,
        SelectedObject[ElementType]>>({
            width: editor?.selectedObjects?.[0]?.width ?? 0,
            height: editor?.selectedObjects?.[0]?.height ?? 0,
            x: editor?.selectedObjects?.[0]?.x ?? 0,
            y: editor?.selectedObjects?.[0]?.y ?? 0,
            angle: editor?.selectedObjects?.[0]?.angle ?? 0,
            diameter: editor?.selectedObjects?.[0]?.diameter ?? 0,
            cornerSize: editor?.selectedObjects?.[0]?.cornerSize ?? 0
        })
    const updateElementState = (key: ElementType, value: SelectedObject[ElementType]) => {
        setElementState(prev => ({
            ...prev,
            [key]: value
        }))
        editor?.updateSelectedObjectProperty(key, value);
    }
    // sync the state with the editor
    React.useEffect(() => {
        const selectedObject = editor?.selectedObjects?.[0]?.object;
        //console.log('selectedObject', selectedObject)
        if (selectedObject) {
            setElementState(prev => ({
                ...prev,
                width: selectedObject.width,
                height: selectedObject.height,
                x: selectedObject.getX(),
                y: selectedObject.getY(),
                angle: selectedObject.angle,
            }))
        }
    }, [editor?.selectedObjects])
    return (
        <div className='mt-2' >
            {
                !isGroup && !Array.isArray(elements) ?
                    <h3
                        className='text-sm font-medium text-muted-foreground px-2 mb-2'
                    >{elements}</h3> :
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='flex items-center gap-x-2 text-sm font-medium text-muted-foreground px-2 mb-2'>
                                <h3>Group({elements.length})</h3>
                                <ChevronDownIcon size={14} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='z-[200000]'>
                            {
                                (elements as string[]).map((item, index) => {
                                    return (
                                        <DropdownMenuItem key={index} className='text-xs cursor-default font-medium'>
                                            {item}
                                        </DropdownMenuItem>
                                    )
                                })
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
            }
            <div
                className='grid w-full grid-cols-2 mt-2 gap-2 rounded-none'
            >
                {
                    elementData.inputs.map((item, index) => {
                        return (
                            (thereIsACircle || item.config.property !== 'diameter') && (thereIsARect || item.config.property !== 'cornerSize') && (
                                <EditorInput
                                    key={index}
                                    type={item.type as Exclude<EditorInputValue, 'color'>}
                                    value={elementState[item.config.property as ElementType]?.toFixed(2)}
                                    Icon={item.Icon}
                                    action={item.action}
                                    property={item.config.property as ElementType}
                                    onChange={(property, value) => {
                                        updateElementState(property as ElementType, value as number)
                                    }}
                                />
                            )

                        )
                    })
                }
            </div>
        </div>
    )
}
