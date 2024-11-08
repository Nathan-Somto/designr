import { SettingsProps } from './types'
import { position } from './data';
import { RenderInput } from './RenderUtils';

export default function PositionSettings({ selectedObject, handleObjectSelection }: SettingsProps) {
    if (!selectedObject) return null;
    const handleChange = (property: string, value: string | number) => {
        if (!selectedObject) return;
        if(property === 'x'){
            selectedObject.object.setX(value as number)
        }
        else if (property === 'y'){
            selectedObject.object.setY(value as number)
        }
       
        else {
            selectedObject.object.set(property, value);
        }
        handleObjectSelection(selectedObject.object);
    };

    return (
        <div className='border-y border-y-neutral-400 py-2 px-4'>
            <h3 className='text-sm font-medium leading-8 text-left'>{position.label}</h3>
            <div className='flex gap-x-2 items-center my-4'>
                {
                    position.inputs.slice(0, 2).map(item => (
                        <RenderInput
                            {...item}
                            key={item.label}
                            handleChange={handleChange}
                            selectedObject={selectedObject}
                            showLabel={false}
                            width='half'
                        />
                    ))
                }
            </div>
            {
                !selectedObject.diameter ?
                    <div className='flex gap-x-2 items-center my-4'>
                        {
                            position.inputs.slice(2, 4).map(item => (
                                <RenderInput
                                    {...item}
                                    key={item.label}
                                    handleChange={handleChange}
                                    selectedObject={selectedObject}
                                    showLabel={false}
                                    width='half'
                                />
                            ))
                        }
                    </div> :

                    position.inputs.slice(4, 5).map(item => (
                        <RenderInput
                            {...item}
                            key={item.label}
                            selectedObject={selectedObject}
                            handleChange={(prop, value) => handleChange(prop, (typeof value === 'number' ? value : parseInt(value)) / 2)}
                            showLabel={false}
                            width='half'

                        />
                    ))

            }

<div className='flex gap-x-2 items-center my-4'>
                {
                    position.inputs.slice(5, 7).map(item => (
                        <RenderInput
                            {...item}
                            key={item.label}
                            handleChange={handleChange}
                            selectedObject={selectedObject}
                            showLabel={false}
                            width='half'
                        />
                    ))
                }
            </div>
        </div>
    )
}
