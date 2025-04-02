import React from 'react'
import { EditorInput } from '../ui/editor-input'
import {
    TextAlignment,
    casing,
    decoration,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    letterSpacing,
    lineHeight,
} from './data'
import EditorButtonSelect from '../ui/editor-button-select'
import EditorSelect from '../ui/editor-select'
import Hint from '@designr/ui/components/hint'
import { HelpCircleIcon } from 'lucide-react'
export default function TextSettings() {
    return (
        <section id="text-settings" className=''>
            <div
                className='flex items-center gap-x-2 mb-2 text-muted-foreground'>
                <h3
                    className='text-xs font-medium'
                >Text</h3>
                <Hint
                    label={`Text settings allow you to change the appearance of the text.`}
                    className='ml-2 z-[500000]'>
                    <HelpCircleIcon size={16} className='cursor-pointer hover:scale-105 hover:border-foreground/20 rounded-full border border-transparent' />
                </Hint>
            </div>
            <div className='grid w-full grid-cols-2  gap-y-3 gap-x-3.5 rounded-none'>
                {/* Editor Select - font family */}
                <EditorSelect
                    value={fontFamily.config.value}
                    action={fontFamily.action}
                    config={fontFamily.config}
                    options={fontFamily.options as string[]}
                    className='col-span-2 -mb-1.5'
                />
                {/* Font weight and Font size Editor input */}
                <EditorSelect
                    value={fontWeight.config.value}
                    action={fontWeight.action}
                    config={fontWeight.config}
                    options={fontWeight.options as { label: string, value: string }[]}
                />
                <EditorInput
                    value={fontSize.config.value}
                    Icon={fontSize.Icon}
                    action={fontSize.action}
                    type={fontSize.type}
                    property={fontSize.config.property ?? ''}
                />
                {/* Letter Spacing and Line Height */}
                <EditorInput
                    value={letterSpacing.config.value}
                    Icon={letterSpacing.Icon}
                    action={letterSpacing.action}
                    type={letterSpacing.type}
                    property={letterSpacing.config.property ?? ''}
                />
                <EditorInput
                    value={lineHeight.config.value}
                    Icon={lineHeight.Icon}
                    action={lineHeight.action}
                    type={lineHeight.type}
                    property={lineHeight.config.property ?? ''}
                />
                {/* Text Alignment and Casing */}
                <div className='flex items-center gap-x-px pl-2'>
                    {TextAlignment.options.map((item, index) => {
                        return (
                            <EditorButtonSelect
                                key={index}
                                value={item.config.value}
                                Icon={item.Icon}
                                action={item.action}
                                property={item.config.property ?? ''}
                                selectedValue='left'
                            />
                        )
                    })}
                </div>
                <div className='flex items-center gap-x-px pr-2'>
                    {casing.options.map((item, index) => {
                        return (
                            <EditorButtonSelect
                                key={index}
                                value={item.config.value}
                                Icon={item.Icon}
                                action={item.action}
                                property={item.config.property ?? ''}
                                selectedValue='uppercase'
                            />
                        )
                    })}
                </div>
                {/* Decoration and Font style */}
                <div className='flex items-center gap-x-px pl-2'>
                    {decoration.options.map((item, index) => {
                        return (
                            <EditorButtonSelect
                                key={index}
                                value={item.config.value}
                                Icon={item.Icon}
                                action={item.action}
                                property={item.config.property ?? ''}
                                selectedValue='underline'
                            />
                        )
                    })}
                </div>
                <div className='flex items-center gap-x-px pr-2'>
                    {fontStyle.options.map((item, index) => {
                        return (
                            <EditorButtonSelect
                                key={index}
                                value={item.config.value}
                                Icon={item.Icon}
                                action={item.action}
                                property={item.config.property ?? ''}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
