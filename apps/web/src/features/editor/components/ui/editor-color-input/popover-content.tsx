import { Tabs, TabsList, TabsTrigger, TabsContent } from "@designr/ui/components/tabs";
import { EditorGradient } from "@designr/use-editor";
import React, { useState } from "react";
import { BaseColorPicker } from "./base-color-picker";
import { GradientPicker } from "./gradient-picker";
import { colord } from "colord";

export function EditorColorInputPopoverContent({
    value,
    supportsGradient,
    onChange
}: {
    value: string | EditorGradient;
    supportsGradient?: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: (newValue: string | EditorGradient) => void;
}) {
    const [activeTab, setActiveTab] = React.useState<"solid" | "gradient">("solid");
    const [gradient, setGradient] = React.useState<EditorGradient>(
        typeof value === "string"
            ? { type: "linear", direction: "to right", colors: [{ color: value, offset: 0 }, { color: colord(value).lighten(30).toHex(), offset: 1 }] }
            : value
    );
    const [activeFormat, setActiveFormat] = useState<"hex" | "rgba" | "hsl">("hex");

    const handleGradientChange = (updatedGradient: EditorGradient) => {
        onChange(updatedGradient);
        setGradient(updatedGradient);
    };

    return (
        <Tabs
            defaultValue={activeTab}
            onValueChange={(v) => setActiveTab(v as "solid" | "gradient")}>
            <TabsList className="w-full !max-w-full justify-start">
                <TabsTrigger value="solid" className="flex-1">Solid</TabsTrigger>
                {supportsGradient && <TabsTrigger value="gradient" className="flex-1">Gradient</TabsTrigger>}
            </TabsList>

            {/* Solid Color Picker */}
            <TabsContent value="solid" className="mt-6">
                <BaseColorPicker
                    value={typeof value === "string" ? value : "#000"}
                    onChange={onChange}
                    format={activeFormat}
                    onChangeFormat={(format) => setActiveFormat(format)}
                />
            </TabsContent>

            {/* Linear Gradient Editor */}
            {supportsGradient && (
                <TabsContent value="gradient" className="mt-6">
                    <GradientPicker
                        gradient={gradient}
                        updateGradient={handleGradientChange}
                    />
                </TabsContent>
            )}
        </Tabs>
    );
};
