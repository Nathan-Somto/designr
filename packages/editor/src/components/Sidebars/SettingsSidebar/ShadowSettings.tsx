import { shadow } from './data'
import { RenderColor, RenderInput } from './RenderUtils'
import { SettingsProps } from './types'
//import * as fabric from 'fabric'

export default function ShadowSettings({handleObjectSelection, selectedObject} : SettingsProps) {
   if(!selectedObject?.object) return null
    const handleChange = (property: string, value: string | number) => {
        /* selectedObject.object.shadow = new fabric.Shadow({
            color: selectedObject['shadow.color'],
            blur: selectedObject['shadow.blur'],
            offsetX: selectedObject['shadow.offsetX'],
            offsetY: selectedObject['shadow.offsetY'],
            [property]: value
        })
        selectedObject.object.dirty = true; */
        selectedObject.object.set(property, value)

        handleObjectSelection(selectedObject.object, true)
    }
  return (
    <div className='px-4 py-2 space-y-2'>
         <h3 className='text-sm font-medium leading-8 text-left'>{shadow.label}</h3>
         {shadow.inputs.slice(0,1).map(item => {
             if (item?.renderType === 'color') {
                return <RenderColor
                    handleChange={handleChange}
                    key={item.label}
                    {...item}
                    selectedObject={selectedObject}
                    type="string"
                />
            }
            return null
})}
    <div className='flex gap-x-2 items-center my-4'>
        {shadow.inputs.slice(1, 3).map(item => {
            if(item.Icon === undefined) return null
            return <RenderInput
            handleChange={handleChange}
            key={item.label}
            {...item}
            selectedObject={selectedObject}
             width='half'
            />
        }
        )}
    </div>
    </div>
  )
}
