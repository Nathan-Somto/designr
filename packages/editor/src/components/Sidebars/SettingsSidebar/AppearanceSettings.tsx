import { appearance } from './data'
import { RenderColor, RenderInput } from './RenderUtils'
import { SettingsProps } from './types'

function AppearanceSettings({ handleObjectSelection, selectedObject }: SettingsProps) {
    if (!selectedObject) return null
    const handleChange = (property: string, value: string | number) => {

        selectedObject.object.set(property, value)
        handleObjectSelection(selectedObject.object)
    }
    return (
        <div className='px-4 py-2 border-b space-y-2 border-b-neutral-400'>
            <h3 className='text-sm font-medium leading-8 text-left'>{appearance.label}</h3>
            {
                appearance.inputs.map(item => {
                    if (item?.renderType === 'color') {
                        return <RenderColor
                            handleChange={handleChange}
                            key={item.label}
                            {...item}
                            selectedObject={selectedObject}
                            type="string"
                        />
                    }
                    if(item.Icon === undefined) return null
                    return <RenderInput
                        handleChange={handleChange}
                        key={item.label}
                        {...item}
                        selectedObject={selectedObject}
                    />
                })
            }
        </div>
    )
}

export default AppearanceSettings