
import { SettingsProps, } from './types';

import { Alignment, decoration, casing, fontFamily, fontSize, fontStyle, fontWeight, letterSpacing, lineHeight } from './data';
import { RenderButtons, RenderInput, RenderSelect } from './RenderUtils';

export default function TextSettings({ selectedObject, handleObjectSelection }: SettingsProps) {
    if (!selectedObject || selectedObject.object.type !== 'textbox') return null;

    const handleChange = (property: string, value: string | number) => {
        if (!selectedObject) return;
        if(property === 'textDecoration'){
            selectedObject.object.set('underline', value === 'underline');
            selectedObject.object.set('lineThrough', value === 'line-through');
        }
        selectedObject.object.set(property, value);
        handleObjectSelection(selectedObject.object);
    };


    return (
        <div className='py-2 px-4 space-y-4'>
            <h3 className='text-sm font-medium mb-3 text-left'>Typography</h3>
            <RenderSelect
                handleChange={handleChange}
                label={fontFamily.label}
                options={fontFamily.options}
                selectedObject={selectedObject}
                selectedObjectProp='fontFamily'
            />
            <div className='flex gap-x-2 items-center my-4'>
                <RenderSelect
                    handleChange={handleChange}
                    label={fontWeight.label}
                    options={fontWeight.options}
                    selectedObject={selectedObject}
                    selectedObjectProp='fontWeight'
                />
                <RenderSelect
                    handleChange={handleChange}
                    label={fontStyle.label}
                    options={fontStyle.options}
                    selectedObject={selectedObject}
                    selectedObjectProp='fontStyle'
                />
            </div>
            <RenderInput
                Icon={fontSize.Icon}
                handleChange={handleChange}
                label={fontSize.label}
                selectedObject={selectedObject}
                selectedObjectProp='fontSize'
                type={fontSize.type as 'int'}
                value={fontSize.value}
                width='full'
            />
            <div className='flex gap-x-2 items-center'>
                <RenderInput
                    Icon={lineHeight.Icon}
                    handleChange={handleChange}
                    label={lineHeight.label}
                    selectedObject={selectedObject}
                    selectedObjectProp='lineHeight'
                    type={lineHeight.type as 'int'}
                    value={lineHeight.value}
                    width='sm'
                />
                <RenderInput
                    Icon={letterSpacing.Icon}
                    handleChange={handleChange}
                    label={letterSpacing.label}
                    selectedObject={selectedObject}
                    selectedObjectProp='letterSpacing'
                    type={letterSpacing.type as 'int'}
                    value={letterSpacing.value}
                    width='sm'
                />
            </div>
            <RenderButtons
                handleChange={handleChange}
                label={Alignment.label}
                options={Alignment.options}
                selectedObject={selectedObject}
                selectedObjectProp='textAlign'
            />
            <RenderButtons
                handleChange={handleChange}
                label={decoration.label}
                options={decoration.options}
                selectedObject={selectedObject}
                selectedObjectProp='textDecoration'
            />
            <RenderButtons
                handleChange={handleChange}
                label={casing.label}
                options={casing.options}
                selectedObject={selectedObject}
                selectedObjectProp='textTransform'
            />
        </div>
    );
}
