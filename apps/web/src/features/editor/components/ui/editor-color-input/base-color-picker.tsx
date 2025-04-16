import { Select, SelectContent, SelectItem, SelectTrigger } from "@designr/ui/components/select";
import { colord } from "colord";
import React, { useState } from "react";
import {
    HexColorPicker,
    RgbaColorPicker,
    HslColorPicker,
    HslColor,
    RgbaColor
} from "react-colorful";

interface BaseColorPickerProps {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (color: string) => void;
    format: "hex" | "rgba" | "hsl";
    // eslint-disable-next-line no-unused-vars
    onChangeFormat?: (format: "hex" | "rgba" | "hsl") => void;
}

const convertColor = (value: string, format: "hex" | "rgba" | "hsl") => {
    switch (format) {
        case "hex":
            return colord(value).toHex();
        case "rgba":
            return colord(value).toRgbString();
        case "hsl":
            return colord(value).toHslString();
        default:
            return value;
    }
};

export function BaseColorPicker({ value, onChange, format, onChangeFormat }: BaseColorPickerProps) {
    const [inputValue, setInputValue] = useState(value);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const hex = value.startsWith('#') ? value.slice(1) : value;
        if (hex.length > 6) return;
        if (hex.length === 3 || hex.length === 6) {
            setInputValue(value);
            onChange(value);
        } else {
            setInputValue(value);
        }
    };


    const handleNumberInputChange = (field: string, newValue: number) => {
        if (format === "rgba") {
            const rgba = colord(value).toRgb();
            const updatedColor = {
                r: field === "r" ? (isNaN(newValue) ? 0 : newValue) : rgba.r,
                g: field === "g" ? (isNaN(newValue) ? 0 : newValue) : rgba.g,
                b: field === "b" ? (isNaN(newValue) ? 0 : newValue) : rgba.b,
                a: field === "a" ? (isNaN(newValue) ? 1 : newValue) : rgba.a
            };
            onChange(`rgba(${updatedColor.r}, ${updatedColor.g}, ${updatedColor.b}, ${updatedColor.a})`);
        } else if (format === "hsl") {
            const hsl = colord(value).toHsl();
            const updatedColor = {
                h: field === "h" ? (isNaN(newValue) ? 0 : newValue) : hsl.h,
                s: field === "s" ? (isNaN(newValue) ? 0 : newValue) : hsl.s,
                l: field === "l" ? (isNaN(newValue) ? 0 : newValue) : hsl.l
            };
            onChange(`hsl(${updatedColor.h}, ${updatedColor.s}%, ${updatedColor.l}%)`);
        }
    };

    return (
        <div>
            {format === "hex" && (
                <HexColorPicker color={value} onChange={(c) => {
                    onChange(c)
                    setInputValue(c)
                }} className="!w-full" />
            )}
            {format === "rgba" && (
                <RgbaColorPicker
                    color={value as unknown as RgbaColor}
                    onChange={(c) => {
                        onChange(`rgba(${isNaN(c.r) ? 0 : c.r}, ${isNaN(c.g) ? 0 : c.g}, ${isNaN(c.b) ? 0 : c.b}, ${isNaN(c.a) ? 1 : c.a})`)
                        setInputValue(`rgba(${isNaN(c.r) ? 0 : c.r}, ${isNaN(c.g) ? 0 : c.g}, ${isNaN(c.b) ? 0 : c.b}, ${isNaN(c.a) ? 1 : c.a})`)
                    }
                    }
                    className="!w-full"
                />
            )}
            {format === "hsl" && (
                <HslColorPicker
                    color={value as unknown as HslColor}
                    onChange={(c) => {
                        onChange(`hsl(${isNaN(c.h) ? 0 : c.h}, ${isNaN(c.s) ? 0 : c.s}%, ${isNaN(c.l) ? 0 : c.l}%)`)
                        setInputValue(`hsl(${isNaN(c.h) ? 0 : c.h}, ${isNaN(c.s) ? 0 : c.s}%, ${isNaN(c.l) ? 0 : c.l}%)`)
                    }}
                    className="!w-full"
                />
            )}

            <div className={`mt-5 flex gap-2 ${format === "hex" ? "flex-row items-center" : "flex-col "}`}>
                {format === "hex" ? (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleHexInputChange}
                        className="w-full flex-[0.9] h-[36px] outline-none focus-within:border-muted-foreground pl-3 py-1 pr-1 border-background text-left text-sm border rounded"
                    />
                ) : (
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {(format === "rgba"
                            ? ["r", "g", "b", "a"]
                            : ["h", "s", "l"]
                        ).map((channel) => (
                            <div key={channel} className="flex flex-col items-center">
                                <span className="self-start ml-2 mb-1 text-xs font-medium text-left uppercase">
                                    {channel}
                                </span>
                                <input
                                    type="number"
                                    min={channel === "a" ? 0 : format === "hsl" ? 0 : 0}
                                    max={channel === "a" ? 1 : format === "hsl" ? (channel === "h" ? 360 : 100) : 255}
                                    step={channel === "a" ? 0.01 : 1}
                                    value={
                                        format === "rgba"
                                            ? colord(value).toRgb()[channel as keyof RgbaColor]
                                            : colord(value).toHsl()[channel as keyof HslColor]
                                    }
                                    onChange={(e) =>
                                        handleNumberInputChange(channel, parseFloat(e.target.value))
                                    }
                                    className="w-full text-center border border-background focus:border-muted-foreground rounded p-1 outline-none"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Select
                    value={format}
                    onValueChange={(v) => {
                        const newColor = convertColor(value, v as "hex" | "rgba" | "hsl");
                        onChange(newColor);
                        setInputValue(newColor);
                        onChangeFormat?.(v as "hex" | "rgba" | "hsl");
                    }}
                >
                    <SelectTrigger className={`${format !== "hex" ? "w-full" : "flex-[0.3]"} text-xs capitalize text-center hover:border-muted-foreground font-medium border-background rounded-md px-2 py-1`}>
                        {format}
                    </SelectTrigger>
                    <SelectContent className="z-[20000]">
                        {["hex", "rgba", "hsl"].map((f) => (
                            <SelectItem className="capitalize" key={f} value={f}>
                                {f}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
