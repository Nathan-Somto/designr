import React from 'react'
import { AnimatePresence, motion } from "motion/react";
export default function ErrorToast({ error }: { error: string | null }) {
    return (
        <AnimatePresence>
            {error && <motion.div
                initial={{
                    y: 20,
                    opacity: 0
                }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    duration: 0.35,
                    ease: 'easeIn'
                }}
                exit={{
                    y: 20,
                    opacity: 0
                }}
                className="bg-destructive text-white px-2.5 mb-3.5 rounded-md py-1.5 w-[90%] mx-auto text-sm"
            >
                <p>
                    {error}
                </p>
            </motion.div>
            }
        </AnimatePresence>
    )
}
