import React from 'react';
import { EditorInputValue } from '../../types';
import Hint from '@designr/ui/components/hint';
import { cn } from '@designr/ui/lib/utils';

interface EditorInputProps {
    action: string;
    type: Omit<EditorInputValue, 'color'>;
    Icon: () => JSX.Element;
    property: string;
    value?: string | number // Current value
    // eslint-disable-next-line no-unused-vars
    onChange?: (key: string, value: string | number) => void;
    className?: string
}

export function EditorInput({
    Icon,
    action,
    property,
    onChange,
    value,
    type,
    className
}: EditorInputProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!property) return;
        let newValue: any = e.target.value;

        // Convert value based on type
        if (type === 'int') {
            newValue = parseInt(newValue, 10);
            if (isNaN(newValue)) newValue = 0;
        } else if (type === 'float') {
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) newValue = 0.0;
        }

        onChange?.(property, newValue);
    };

    return (
        <Hint
            label={action}
            className='z-[200000]'
        >
            <div className={cn("flex bg-transparent text-muted-foreground focus-within:text-primary/70 focus-visible:text-primary/70  items-center border-transparent border hover:border-muted-foreground rounded-md px-2 py-1 focus-within:bg-primary/30 focus-within:border-primary focus-visible:border-primary transition", className)}>
                <span className="mr-2 [&>~]:!size-[18px]">
                    <Icon />
                </span>
                <input
                    type="text"
                    value={value as string | number}
                    onChange={handleInputChange}
                    className="bg-transparent focus:outline-none w-full text-xs"
                />
            </div>
        </Hint>
    );
};

