import { EditorGradient, EditorGradientDirection } from '@designr/use-editor';
import { PlusIcon, XIcon } from 'lucide-react';
import React from 'react'
import { BaseColorPicker } from './base-color-picker';
import { formatEditorGradientToCSS } from './format-editor-gradient-to-css';
import Hint from '@designr/ui/components/hint';
import { v4 as uuidV4 } from 'uuid';
import { GRADIENT_DIRECTIONS } from './data';

interface GradientPickerProps {
    gradient: EditorGradient;
    // eslint-disable-next-line no-unused-vars
    updateGradient: (gradient: EditorGradient) => void;
}
export function GradientPicker({
    gradient,
    updateGradient
}: GradientPickerProps) {
    const [currentColor, setCurrentColor] = React.useState<string | null>('');
    const [currentColorId, setCurrentColorId] = React.useState<string | null>('');
    const [format, setFormat] = React.useState<'hex' | 'rgba' | 'hsl'>('hex');
    const [gradientColorsWithId, setGradientColorsWithId] = React.useState<(EditorGradient['colors'][number] & { id: string })[]>([]);
    console.log("gradient", gradient);
    React.useEffect(() => {
        setGradientColorsWithId(gradient.colors.map((color) => ({ ...color, id: uuidV4() })));
    }, [])
    return (
        <div
            className='flex mt-5 flex-col gap-2'
        >
            <div className="flex mb-4 items-center gap-2 flex-wrap">
                {gradientColorsWithId.map((stop) => {
                    return <div
                        key={stop.id}
                        data-active={currentColorId === stop.id}
                        className="relative size-8 group border-muted data-[active=true]:border-primary data-[active=true]:border-2 hover:border-primary hover:border-2 p-2 rounded-full cursor-pointer border"
                        style={{ background: stop.color }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentColor(stop.color);
                            setCurrentColorId(stop.id);
                            // get the color format type based on the stop color
                            setFormat(
                                stop.color.startsWith('#') ? 'hex' :
                                    stop.color.startsWith('rgba') ? 'rgba' :
                                        'hsl'
                            );
                        }}
                    >
                        {
                            gradientColorsWithId.length > 2 && (

                                <button
                                    className="absolute -top-2 -right-2 group-hover:opacity-100 opacity-0 bg-black/80 justify-center items-center flex text-white rounded-full text-xs size-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newColors = gradientColorsWithId.filter((_) => _.id !== stop.id);
                                        if (stop.id === currentColorId) {
                                            setCurrentColor(null);
                                            setCurrentColorId(null);
                                        }
                                        updateGradient({ ...gradient, colors: newColors });
                                        setGradientColorsWithId(newColors);
                                    }}
                                >
                                    <XIcon size={12} />
                                </button>
                            )
                        }
                    </div>
                }
                )}

                {/* Add Color Button */}
                <button
                    className="w-8 h-8 flex items-center hover:opacity-50 bg-gradient-to-r from-primary/50 to-[rgb(156,202,254)] justify-center rounded-full"
                    /* put a rainbow gradient as the color, make it radial */
                    onClick={() => {
                        const newColor = {
                            color: '#fff',
                            offset: gradient.colors.length
                        }
                        updateGradient({
                            ...gradient,
                            colors: [...gradient.colors, newColor]
                        });
                        const id = uuidV4();
                        setCurrentColor(newColor.color);
                        setCurrentColorId(id)
                        setGradientColorsWithId([...gradientColorsWithId, { ...newColor, id }]);
                    }}
                >
                    <div className='bg-white text-muted-foreground size-4 grid place-items-center  rounded-full'>
                        <PlusIcon size={14} />
                    </div>
                </button>
            </div>
            {currentColor && <BaseColorPicker
                value={currentColor}
                onChange={(newColor) => {
                    // update based on id
                    const newColors = gradientColorsWithId.map((color) => {
                        if (color.id === currentColorId) {
                            return { ...color, color: newColor };
                        }
                        return {
                            ...color,
                        };
                    });
                    setGradientColorsWithId(newColors);
                    updateGradient({ ...gradient, colors: newColors });
                }}
                format={format}
                onChangeFormat={setFormat}
            />}
            <div className="grid grid-cols-4 mt-3 gap-2 p-2">
                {GRADIENT_DIRECTIONS.map(({ label, value }) => (
                    <Hint
                        label={`${value}(${label})`}
                        className='z-[20000]'
                        key={value}>
                        <button
                            onClick={() => {
                                updateGradient({ ...gradient, direction: value });
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded border-2 
                        ${gradient.direction === value ? "border-primary" : "border-muted"}`}
                            style={{ background: formatEditorGradientToCSS({ type: "linear", direction: value, colors: gradientColorsWithId }) }}
                        >
                            <span className='sr-only'>{label}</span>
                        </button>
                    </Hint>
                ))}
            </div>
        </div>
    )
}
