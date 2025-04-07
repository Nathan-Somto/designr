import React from 'react'
import { PlusIcon, MinusIcon } from 'lucide-react'
import { Button } from '@designr/ui/components/button'
interface EditorShowPanelProps<T extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>> {
    // eslint-disable-next-line no-unused-vars
    ComponentToRender: (props: React.ComponentProps<T>) => React.ReactNode
    label: string
    id: string
    /* used to set default properties */
    onShow?: () => void
    /* used to remove default properties */
    onHide?: () => void,
    open?: boolean
    props: React.ComponentProps<T>
}
export default function EditorShowPanel<T extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>>({
    ComponentToRender,
    label,
    id,
    open,
    props
}: EditorShowPanelProps<T>) {
    const [show, setShow] = React.useState(false)
    React.useEffect(() => {
        setShow(open ?? false)
    }, [open])
    React.useEffect(() => {
        return () => {
            console.log("unmounting the fill settings")
            //onHide?.()
        }
    }, [])
    const handleShowToggle = () => {
        setShow(!show)
    }
    return (
        <section id={id}>
            <div className='grid grid-cols-4 items-center justify-between px-2 mb-2 text-muted-foreground'>
                <h3 className='text-xs col-span-3 font-medium'>{label}</h3>
                <Button variant={'ghost'} size="shrink" className='size-5 col-span-1 ml-auto py-[0.25rem] rounded-md !px-4'
                    onClick={() => handleShowToggle()}>
                    {show ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
                </Button>
            </div>
            {show && <ComponentToRender key={id} {...(props)} />}
        </section>
    )
}
