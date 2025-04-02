import React from 'react'
import Hint from '@designr/ui/components/hint'
import { Button } from '@designr/ui/components/button'
interface EditorButtonSelectProps {
    action: string
    property: string
    value?: string
    selectedValue?: string
    // eslint-disable-next-line no-unused-vars
    onChange?: (key: string, value: string) => void
    Icon: () => JSX.Element
    className?: string
}
export default function EditorButtonSelect({
    action,
    property,
    onChange,
    value,
    Icon,
    selectedValue,
    className
}: EditorButtonSelectProps) {

    return (
        <Hint label={action} className='z-[50000]'>
            <Button
                className={` ${className} transition-colors ease-in duration-200 delay-100 hover:bg-muted hover:text-foreground/80 border border-transparent   data-[active=true]:text-foreground/80 data-[active=true]:bg-muted !rounded-none !py-1 h-[2rem] bg-transparent text-muted-foreground !shadow-none hover:b [&>svg]:!size-3.5`}
                size='shrink'
                data-active={selectedValue === value}
                value={value}
                onClick={(e) => {
                    e.preventDefault();
                    if (!value) return
                    onChange?.(property, value);
                }}
                type='button'
                aria-checked={selectedValue === value}
            >
                <Icon />
            </Button>
        </Hint>
    )
}
