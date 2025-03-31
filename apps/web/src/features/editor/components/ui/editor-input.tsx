import React from 'react';
import { EditorInputValue, ObjectLike } from '../../types';
import Hint from '@designr/ui/components/hint';

interface EditorInputProps<O extends ObjectLike> {
    action: string;
    type: Omit<EditorInputValue, 'color'>;
    Icon: () => JSX.Element;
    config: O;
    value?: string | number // Current value
    // eslint-disable-next-line no-unused-vars
    onChange?: (key: string, value: string | number) => void;
}

export function EditorInput<O extends ObjectLike>({
    Icon,
    action,
    config,
    onChange,
    value,
    type
}: EditorInputProps<O>) {
    const configKey = React.useRef<string | null>(null);
    React.useEffect(() => {
        configKey.current = Object.keys(config)[0];
    }, [config]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!configKey.current) return;
        let newValue: any = e.target.value;

        // Convert value based on type
        if (type === 'int') {
            newValue = parseInt(newValue, 10);
            if (isNaN(newValue)) newValue = 0;
        } else if (type === 'float') {
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) newValue = 0.0;
        }

        onChange?.(configKey.current, newValue);
    };

    return (
        <Hint
            label={action}
            className='z-[200000]'
        >
            <div className="flex bg-transparent text-muted-foreground focus-within:text-primary/70 focus-visible:text-primary/70  items-center border-transparent border hover:border-muted-foreground rounded-md px-2 py-1 focus-within:bg-primary/30 focus-within:border-primary focus-visible:border-primary transition">
                <span className="mr-2">
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

