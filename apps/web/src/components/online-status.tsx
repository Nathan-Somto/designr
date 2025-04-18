import { CloudIcon, CloudOffIcon } from 'lucide-react'
import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
type Props = {
    isOnline: boolean
    position?: 'top' | 'bottom'
}
export default function OnlineStatus({
    position = 'top',
    isOnline
}: Props) {
    const [show, setShow] = React.useState(false);
    const hasMounted = React.useRef(false);
    React.useEffect(() => {
        if (hasMounted.current) {
            setShow(true)
            const timeout = setTimeout(() => setShow(false), 4500)
            return () => clearTimeout(timeout)
        }
        hasMounted.current = true
    }, [isOnline])
    return (
        <AnimatePresence>
            {
                show && (

                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        role='alert'
                        key={'online-status'}
                        style={{
                            top: position === 'top' ? 20 : 'auto',
                            bottom: position === 'bottom' ? 20 : 'auto'
                        }}
                        className='rounded-lg z-[30000000] max-w-fit [&>p]:text-sm [&>svg]:!size-4 fixed inset-x-0 px-5 py-2 h-10 mx-auto flex items-center gap-x-2 bg-black/80 backdrop-blur-md text-white'
                    >
                        {
                            isOnline ? <>
                                <CloudIcon />
                                <p>
                                    You are online
                                </p>
                            </> :
                                <>
                                    <CloudOffIcon />
                                    <p>You've gone offline</p>
                                </>
                        }
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}
