import { Select, SelectContent, SelectItem, SelectTrigger } from '@designr/ui/components/select'
import React from 'react'
import { ObjectLike } from '../../types'
import Hint from '@designr/ui/components/hint'
import { cn } from '@designr/ui/lib/utils'
interface EditorSelectProps<O extends ObjectLike> {
    value?: string | number
    // eslint-disable-next-line no-unused-vars
    onChange?: (key: string, value: string | number) => void;
    options: (string[]) | ({ label: string, value: number | string, Icon?: () => JSX.Element })[];
    Icon: () => JSX.Element;
    action: string;
    config: O;
    className?: string;
}
export default function EditorSelect<O extends ObjectLike>({
    Icon,
    action,
    config,
    options,
    value,
    onChange,
    className
}: EditorSelectProps<O>) {
    const configKey = React.useRef<string | null>(null);
    const configValueType = React.useRef<string | null>(null);
    const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(action);
    React.useEffect(() => {
        configKey.current = Object.keys(config)[0];
        if (configKey.current && typeof configKey.current === 'string') {
            //@ts-ignore
            configValueType.current = typeof config[configKey.current as string];
        }
    }, [config]);
    const handleSelectChange = (value: string) => {
        if (!configKey.current) return;
        let newValue: string | number = value;
        if (configValueType.current === 'number') {
            newValue = +value;
        }
        onChange?.(configKey.current, newValue);
        setSelectedValue(value);
    };
    return (
        <Select
            onValueChange={handleSelectChange}
            value={value as string}
        >
            <SelectTrigger
                className={cn("focus-visible:ring-transparent", className)}
            >
                <Hint
                    label={action}
                    className='z-[200000]'
                >
                    <div className="flex text-muted-foreground text-xs items-center gap-2">
                        {<Icon />}
                        {selectedValue}
                    </div>
                </Hint>
            </SelectTrigger>
            <SelectContent className='z-[200000]'>
                {options.map((option) => (
                    <SelectItem
                        key={((typeof option === 'object') ? option.value : option) as string}
                        value={(typeof option === 'object' ? option.value : option) as string}
                        className="py-3"
                    >

                        <div className="flex items-center gap-2 [&>svg]:size-3.5 text-xs">
                            {/* Render the options icon if present */}
                            {typeof option === 'object' && option.Icon && <option.Icon />}
                            {
                                (typeof option === 'object' ? option.label : option) as string
                            }
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
