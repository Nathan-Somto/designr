import React from 'react'
import { PlusIcon, MinusIcon } from 'lucide-react'
import { Button } from '@designr/ui/components/button'
interface EditorShowPanelProps {
    ComponentToRender: () => React.ReactNode
    label: string
    id: string
    /* used to set default properties */
    onShow?: () => void
    /* used to remove default properties */
    onHide?: () => void
}
export default function EditorShowPanel({
    ComponentToRender,
    label,
    id,
    onShow,
    onHide
}: EditorShowPanelProps) {
    const [show, setShow] = React.useState(false)
    const handleShowToggle = () => {
        setShow(!show)
        if (show) {
            onHide?.()
        } else {
            onShow?.()
        }
    }
    return (
        <section id={id}>
            <div className='flex items-center justify-between px-2 mb-2 text-muted-foreground'>
                <h3 className='text-xs font-medium'>{label}</h3>
                <Button variant={'ghost'} size="shrink" className='size-5 py-[0.25rem] rounded-md !px-4'
                    onClick={() => handleShowToggle()}>
                    {show ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
                </Button>
            </div>
            {show && <ComponentToRender />}
        </section>
    )
}
