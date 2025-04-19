'use client';
import { useState } from "react";
import Hint from "@designr/ui/components/hint";
import { Dialog, DialogContent } from "@designr/ui/components/dialog";
import { Input } from "@designr/ui/components/input";
import { Button } from "@designr/ui/components/button";
import { editorPresets } from "./data";
import { useRouter } from "next/navigation";
import { LINKS } from "#/constants/links";
import { Variants, motion } from "motion/react";

export default function EditorPresetsList() {
    const [showDialog, setShowDialog] = useState(false);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const router = useRouter()
    const handlePresetClick = (preset: any) => {
        if (preset.custom) {
            setShowDialog(true);
        } else if (preset.import) {
            console.log("import selection")
        } else {
            console.log('preset selected')
        }
        router.push(LINKS.EDITOR)
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
    return (
        <>

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


            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-sm">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Custom Size</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Width"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                            <Input
                                placeholder="Height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full"
                            disabled={!width || !height}
                            onClick={() => {
                                // Handle custom size logic
                                setShowDialog(false);
                            }}
                        >
                            Create Design
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
