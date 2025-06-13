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
import { Alignment, SelectedObject } from '@designr/use-editor'
import { useEditorStore } from '../../hooks/useEditorStore'
export default function TextSettings() {
    const { editor } = useEditorStore();
    const [textState, setTextState] = React.useState<Record<
        'fontFamily' |
        'fontWeight' |
        'fontSize' |
        'letterSpacing' |
        'lineHeight' |
        'textAlign' |
        'textTransform' |
        'textDecoration' |
        'fontStyle'
        , SelectedObject[
        'fontFamily' |
        'fontWeight' |
        'fontSize' |
        'letterSpacing' |
        'lineHeight' |
        'textAlign' |
        'textTransform' |
        'textDecoration' |
        'fontStyle']>>({
            fontFamily: editor?.selectedObjects?.[0]?.fontFamily,
            fontSize: editor?.selectedObjects?.[0]?.fontSize,
            fontWeight: editor?.selectedObjects?.[0]?.fontWeight,
            textAlign: editor?.selectedObjects?.[0]?.textAlign,
            textDecoration: editor?.selectedObjects?.[0]?.textDecoration,
            letterSpacing: editor?.selectedObjects?.[0]?.letterSpacing,
            lineHeight: editor?.selectedObjects?.[0]?.lineHeight,
            fontStyle: editor?.selectedObjects?.[0]?.fontStyle,
            textTransform: editor?.selectedObjects?.[0]?.textTransform
        })
    const updateTextState = (key: keyof typeof textState, value: typeof textState[keyof typeof textState]) => {
        setTextState(prev => ({
            ...prev,
            [key]: value
        }))
        editor?.updateSelectedObjectProperty(key, value);
    }
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
                    value={textState?.fontFamily ?? fontFamily.config.value}
                    action={fontFamily.action}
                    config={fontFamily.config}
                    options={fontFamily.options as string[]}
                    className='col-span-2 -mb-1.5'
                    onChange={(_, value) => updateTextState('fontFamily', value)}
                />
                {/* Font weight and Font size Editor input */}
                <EditorSelect
                    value={textState?.fontWeight ?? fontWeight.config.value}
                    action={fontWeight.action}
                    config={fontWeight.config}
                    options={fontWeight.options as { label: string, value: string }[]}
                    onChange={(_, value) => updateTextState('fontWeight', value)}
                />
                <EditorInput
                    value={textState?.fontSize ?? fontSize.config.value}
                    Icon={fontSize.Icon}
                    action={fontSize.action}
                    type={'int'}
                    property={fontSize.config.property ?? ''}
                    onChange={(_, value) => updateTextState('fontSize', value)}
                />
                {/* Letter Spacing and Line Height */}
                <EditorInput
                    value={textState?.letterSpacing ?? letterSpacing.config.value}
                    Icon={letterSpacing.Icon}
                    action={letterSpacing.action}
                    type={'float'}
                    property={letterSpacing.config.property ?? ''}
                    onChange={(_, value) => updateTextState('letterSpacing', value)}
                />
                <EditorInput
                    value={textState?.lineHeight ?? lineHeight.config.value}
                    Icon={lineHeight.Icon}
                    action={lineHeight.action}
                    type={'float'}
                    property={lineHeight.config.property ?? ''}
                    onChange={(_, value) => updateTextState('lineHeight', value)}
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
                                selectedValue={(textState?.textAlign ?? item.config.value) as Alignment}
                                onChange={(_, value) => updateTextState('textAlign', value)}
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
                                selectedValue={(textState?.textTransform ?? 'uppercase') as string}
                                onChange={(_, value) => updateTextState('textTransform', value)}
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
                                selectedValue={(textState?.textDecoration ?? 'none') as string}
                                onChange={(_, value) => updateTextState('textDecoration', value)}
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
                                selectedValue={(textState?.fontStyle ?? 'normal') as string}
                                property={item.config.property ?? ''}
                                onChange={(_, value) => updateTextState('fontStyle', value)}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
