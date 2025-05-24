'use client';
import { useEffect, useState } from "react";
import Hint from "@designr/ui/components/hint";

import { editorPresets } from "./data";
import { Variants, motion } from "motion/react";
import { useCreateProjectDialog } from "./hooks/use-project-create-dialog";
import { useFilePicker } from "#/hooks/useFilePicker";
import { toast } from "sonner";


export default function EditorPresetsList() {
    const [showDialog, setShowDialog] = useState(false);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [initialData, setInitialData] = useState<string | null>(null);
    const {
        InputElement,
        onFilePickerClick: onJsonPickerClick,
        error
    } = useFilePicker({
        onGetFile: (json) => {
            console.log("the json data: ", json)
            setInitialData(json);
            setShowDialog(true);
        },
        acceptedTypes: ['json']
    })
    const handlePresetClick = (preset: typeof editorPresets[number]) => {
        if (preset.import) {
            console.log("import selection")
            onJsonPickerClick();
        } else {
            // extract the Dimensions if present and set the width and height
            if (preset.size) {
                const [width, height] = preset.size.split('x').map(Number);
                setWidth(width);
                setHeight(height);
            } else {
                setWidth(0);
                setHeight(0);
            }
            setShowDialog(true)
        }
    };
    const parentVariants: Variants = {
        initial: {
            opacity: 0,

        },
        animate: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                delayChildren: 0.5,
                staggerChildren: 0.13,
                duration: 0.13
            }
        }
    }
    const childVariants: Variants = {
        initial: {
            y: 20,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.2,
                ease: 'easeIn'
            }
        },
    }
    const {
        dialog
    } = useCreateProjectDialog({
        open: showDialog,
        onOpenChange: setShowDialog,
        defaultHeight: height,
        defaultWidth: width,
        defaultData: initialData
    })
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <>
            <InputElement />
            <motion.div
                variants={parentVariants}
                initial='initial'
                animate='animate'
                className="flex mx-auto mt-10 lg:w-[750px]  w-[min(650px,90%)]  overflow-x-auto no-scrollbar gap-4 py-2 px-1"
            >
                {editorPresets.map((preset, index) => {
                    const Icon = preset.icon;
                    const content = (
                        <motion.div
                            variants={childVariants}
                            key={index}
                            onClick={() => handlePresetClick(preset)}
                            className="flex flex-col items-center justify-center gap-1 min-w-[72px] cursor-pointer"
                        >
                            <div
                                className={`rounded-lg p-3 ${preset.bg} transition hover:scale-105`}
                            >
                                <Icon className={`size-5 ${preset.iconColor ?? "text-black/50"}`} />
                            </div>
                            <span className="text-xs text-muted-foreground text-center mx-auto inline-block">{preset.label}</span>
                        </motion.div>
                    );

                    return preset.size ? (
                        <Hint key={index} label={preset.size} side="top">
                            {content}
                        </Hint>
                    ) : (
                        content
                    );
                })}
            </motion.div>
            {dialog}
        </>
    );
}
