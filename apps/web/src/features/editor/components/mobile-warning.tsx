import { LINKS } from '#/constants/links'
import { Button } from '@designr/ui/components/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMediaQuery } from '#/hooks/useMediaQuery'
export default function MobileWarning() {
    const isMatching = useMediaQuery('(max-width:1023px)')
    return (
        <AnimatePresence>
            {
                isMatching && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="mobile-warning"
                        transition={{
                            duration: 0.35,
                            ease: 'easeIn'
                        }}
                        id="editor__mobile-warning"
                        className='fixed inset-0 size-screen bg-white z-[200000] grid place-items-center'
                    >
                        <article className='text-center'>
                            <figure>
                                <Image
                                    src="/logo.svg"
                                    alt="logo"
                                    height={300}
                                    width={300}
                                    className='size-24 mx-auto'
                                />
                            </figure>
                            <h2 className='font-semibold text-xl mt-7 mb-3'>Not Available on Mobile</h2>
                            <div className='text-muted-foreground text-sm mb-3'>
                                <p>To be able to edit or view this file you require a laptop</p>
                                <p>Don't worry our engineers our working hard to support mobile</p>
                            </div>
                            <Button asChild variant={'link'}>
                                <Link href={LINKS.DASHBOARD}>
                                    Go Back Home
                                </Link>
                            </Button>
                        </article>
                    </motion.section>
                )
            }
        </AnimatePresence>
    )
}
