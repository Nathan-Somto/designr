import { convertToType } from './utils';
import { ObjectLike, RenderButtonsProps, RenderInputProps, RenderSelectProps, } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@repo/ui/components/select';
import { cn } from '@repo/ui/lib/utils';
import React from 'react';
const RenderButtons = <T extends ObjectLike>({ handleChange, label, options, selectedObject, selectedObjectProp }: RenderButtonsProps<T>) => {
    return (
        <>
            <label className='text-xs font-medium leading-5 text-left opacity-80'>{label}</label>
            <div className='flex items-center gap-x-2 mt-2'>
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleChange(String(selectedObjectProp), option.config[selectedObjectProp])}
                        className={` px-2 size-9  rounded-md  text-base ${selectedObject[selectedObjectProp] === option.config[selectedObjectProp as string] ? 'bg-blue-200' : 'border-neutral-500 border hover:bg-neutral-500 hover:text-black/70'}`}>
                        {option.Icon()}
                    </button>
                ))}
            </div>
        </>

    )
};
const RenderSelect = <T extends ObjectLike>({ handleChange, options, selectedObject, selectedObjectProp, useCustomValues = false, values = [] }: RenderSelectProps<T>) => {
    return (
        <>
            <Select onValueChange={(value) => handleChange(String(selectedObjectProp), value)}>
                <SelectTrigger>
                    {`${selectedObject[selectedObjectProp] ?? options[0]}`}
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem
                            key={index}
                            value={useCustomValues ? values[index] : option}
                        >
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
};
const RenderInput = <T extends ObjectLike>({ handleChange, value, label, type, selectedObject, selectedObjectProp, Icon, width = 'full', showLabel = true }: RenderInputProps<T>) => {

    return (
        <div className=''>
            {showLabel && (<label className='text-xs font-medium leading-5 text-left opacity-80'>{label}</label>)}
            <div className='flex gap-x-2 items-center'>
                <div className='flex-shrink-0'>
                    {Icon && <Icon />}
                </div>
                <input
                    type={type !== 'string' ? 'number' : 'text'}
                    className={cn('editor-input', width === 'full' && 'max-w-full', width === 'half' && 'max-w-20', width === 'sm' && 'max-w-16')}
                    value={(selectedObject[selectedObjectProp] ?? value) as string | number}
                    onChange={(e) => handleChange(String(selectedObjectProp), convertToType(e.target.value, type))}
                />
            </div>
        </div>
    )
}
const RenderColor = <T extends ObjectLike>({ handleChange, value, label, selectedObject, selectedObjectProp, showLabel = true, }: Omit<RenderInputProps<T>, 'width' | 'Icon'>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
        <div className=''>
            {showLabel && (<label className='text-xs font-medium leading-5 text-left opacity-80'>{label}</label>)}
            <div className=' flex gap-x-1.5 items-center'>
                <button
                    className='w-6 h-6 flex-shrink-0 rounded-md border border-neutral-500'
                    style={{ backgroundColor: `${selectedObject[selectedObjectProp] ?? value}` }}
                    onClick={() => inputRef.current?.click()}
                />
                <input
                    ref={inputRef}
                    type='color'
                    className={cn('invisible w-0 h-0')}
                    value={(selectedObject[selectedObjectProp] ?? value) as string | number}
                    onChange={(e) => handleChange(String(selectedObjectProp), e.target.value)}
                />
                <p className='input w-full'>{`${selectedObject[selectedObjectProp] ?? value}`}</p>
            </div>
        </div>
    )
}
export {
    RenderButtons,
    RenderSelect,
    RenderInput,
    RenderColor
}