import { Select, SelectContent, SelectItem, SelectTrigger } from '@designr/ui/components/select'
import React from 'react'
import Hint from '@designr/ui/components/hint'
import { cn } from '@designr/ui/lib/utils'
interface EditorSelectProps {
    value?: string | number
    // eslint-disable-next-line no-unused-vars
    onChange?: (key: string, value: string | number) => void;
    options: (string[]) | ({ label: string, value: number | string, Icon?: () => JSX.Element })[];
    Icon?: () => JSX.Element;
    action: string;
    config: {
        property: string;
        value?: string | number;
    };
    className?: string;
}
export default function EditorSelect({
    Icon,
    action,
    config,
    options,
    value,
    onChange,
    className
}: EditorSelectProps) {
    const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(action);

    const handleSelectChange = (value: string) => {
        const configValueType = typeof config.value;
        let newValue: string | number = value;
        if (configValueType === 'number') {
            newValue = +value;
        }
        onChange?.(config.property, newValue);
        setSelectedValue(value);
    };
    return (
        <Select
            onValueChange={handleSelectChange}
            value={value as string}
        >
            <SelectTrigger
                className={cn("focus-visible:ring-transparent  !shadow-none flex bg-transparent text-muted-foreground focus-within:text-primary/70 focus-visible:text-primary/70   focus-within:bg-primary/30 focus-within:border-primary focus-visible:border-primary  items-center border-transparent border hover:border-muted-foreground rounded-md px-2 py-1 transition", className)}
            >
                <Hint
                    label={action}
                    className='z-[200000]'
                >
                    <div className="flex text-muted-foreground font-normal text-[11px] items-center gap-2">
                        {Icon && <Icon />}
                        {value ?? selectedValue}
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
