/* eslint-disable no-unused-vars */
'use client'

import { ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'
import {
    Button,
} from '@designr/ui/components/button'
import { Input } from '@designr/ui/components/input'
import { Textarea } from '@designr/ui/components/textarea'
import CompareSlider from './compare-slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@designr/ui/components/select'

type TransformType =
    | 'background_remove'
    | 'generative_fill'
    | 'generative_recolor'
    | 'generative_remove'
    | 'generative_restore'

const transformLabels: Record<TransformType, string> = {
    background_remove: 'Background Removal',
    generative_fill: 'Generative Fill',
    generative_recolor: 'Generative Recolor',
    generative_remove: 'Generative Remove',
    generative_restore: 'Generative Restore'
}

interface Props {
    imageUrl: string
    onBack: () => void
    onSave: (finalImageUrl: string) => void
}

export function TransformImageTab({ imageUrl, onBack, onSave }: Props) {
    const [type, setType] = useState<TransformType | null>(null)
    const [prompt, setPrompt] = useState('')
    const [objectName, setObjectName] = useState('')
    const [color, setColor] = useState('')
    const [resultImage, setResultImage] = useState<string | null>(null)

    const handleTransform = () => {
        setTimeout(() => {
            setResultImage('https://via.placeholder.com/512x512?text=Transformed')
        }, 1000)
    }

    return (
        <section
            id="editor__transform-image-tab"
            className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-x-2 mb-1">
                <Button
                    variant="ghost"
                    size={'icon'}
                    className='!px-0 !w-[24px] !h-fit'
                    onClick={() => {
                        onBack()
                    }}
                >
                    <ChevronLeftIcon className="!size-[20px]" />
                </Button>
                <span className="text-lg font-bold">
                    Transform Image
                </span>
            </div>
            <p className="text-sm pl-2 text-muted-foreground">
                Select a transformation type that you want to apply to the image.
            </p>
            {/* Preview */}
            <div className="mt-6">
                <CompareSlider
                    leftImage={imageUrl}
                    rightImage={resultImage ?? imageUrl}
                />

                {/* Transformation Picker */}
                <div className="mt-8 space-y-4">
                    <Select value={type ?? undefined} onValueChange={(val) => setType(val as TransformType)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a transformation" />
                        </SelectTrigger>
                        <SelectContent className='z-[99999999999]'>
                            {Object.entries(transformLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Inputs Based on Transformation */}
                    {type === 'generative_fill' || type === 'generative_remove' ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prompt</label>
                            <Textarea
                                placeholder="e.g. Remove the chair"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                    ) : null}

                    {type === 'generative_recolor' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Object Name</label>
                                <Input
                                    placeholder="e.g. shirt"
                                    value={objectName}
                                    onChange={(e) => setObjectName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color</label>
                                <Input
                                    placeholder="e.g. red"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="mt-6 flex justify-between gap-3">
                <Button
                    variant="outline"
                    className="flex-1"
                    disabled={!type}
                    onClick={handleTransform}
                >
                    Transform
                </Button>
                <Button
                    className="flex-1"
                    disabled={!resultImage}
                    onClick={() => {
                        if (resultImage) onSave(resultImage)
                    }}
                >
                    Save
                </Button>
            </div>
        </section>
    )
}

