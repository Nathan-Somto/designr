'use client';

import {
    Switch,
} from '@designr/ui/components/switch';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@designr/ui/components/select';
import { Input } from '@designr/ui/components/input';
import { Button } from '@designr/ui/components/button';
import { UserSettings, userSettingsSchema, userSettingsDefaults } from '@designr/db/user-settings';
import { Divider } from '@designr/ui/components/divider';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useSettings } from '../settings-provider';
import { updateUserSettings } from '#/services/settings';


const EXPORT_FORMATS = ['png', 'jpg', 'svg'] as const;
const LAYOUT_POSITIONS = ['left', 'right'] as const;
const ZOOM_CONTROLS = ['bottom-left', 'bottom-right'] as const;
const THEME_OPTIONS = [{
    Icon: SunIcon,
    value: "light",
},
{
    Icon: MoonIcon,
    value: 'dark'
}
]

export function PreferencesSettings() {
    const { settings, updateSettings } = useSettings();
    const [formValues, setFormValues] = useState<UserSettings | null>(userSettingsDefaults);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) setFormValues(settings);
    }, [settings]);

    const handleChange = <T extends keyof UserSettings>(
        key: T,
        value: UserSettings[T]
    ) => {
        if (!formValues) return;
        setFormValues((prev) => prev && { ...prev, [key]: value });
    };
    const normalizeLayout = <T extends keyof UserSettings['layout']>(
        { currentKey, prevLayout, newValue }
            : {
                currentKey: T,
                newValue: (UserSettings['layout'])[T],
                prevLayout: UserSettings['layout']
            }
    ) => {
        const CONFLICTING_LAYOUTS: Record<
            keyof UserSettings['layout'],
            keyof UserSettings['layout'] | null
        > = {
            layersPanel: 'settingsPanel',
            settingsPanel: 'layersPanel',
            zoomControls: 'aiPanel',
            aiPanel: 'zoomControls',
        };

        const OPPOSITE: Record<string, 'left' | 'right' | 'bottom-right' | 'bottom-left'> = {
            left: 'right',
            right: 'left',
            'bottom-left': 'bottom-right',
            'bottom-right': 'bottom-left',
        };
        const newLayout = { ...prevLayout, [currentKey]: newValue };

        const conflictingKey = CONFLICTING_LAYOUTS[currentKey];
        if (conflictingKey && newLayout[conflictingKey] === newValue) {
            newLayout[conflictingKey] = OPPOSITE[newValue] as (UserSettings['layout'])[T];
        }
        return newLayout;
    }
    const handleLayoutChange = <T extends keyof UserSettings['layout']>(
        key: T,
        value: UserSettings['layout'][T]
    ) => {
        if (!formValues) return;
        setFormValues((prev) => {
            if (!prev) return prev;
            const normalizedLayout = normalizeLayout({
                currentKey: key,
                newValue: value,
                prevLayout: prev.layout
            })
            return {
                ...prev,
                layout: normalizedLayout,
            }
        }
        );
    };

    const handleSave = async () => {
        if (!formValues) return;
        setIsSaving(true);
        try {
            const validated = userSettingsSchema.parse(formValues);
            const result = await updateUserSettings(validated);
            console.log("the result: ", result)
            updateSettings(validated);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!formValues) return null;

    return (
        <div className="space-y-6 px-2 py-6 w-[90%]">
            <h2 className='text-2xl font-semibold'>Your Preferences</h2>
            <div className='mb-3'>
                <h3 className='text-lg font-medium mb-1.5'>
                    Accessibility
                </h3>
                <p className='text-sm text-muted-foreground'>
                    make designr fit your accessibility needs
                </p>
            </div>
            <div className="space-y-2">
                <label className='text-sm text-muted-foreground'>Theme</label>
                <Select
                    value={formValues.theme}
                    onValueChange={(val) =>
                        handleChange('theme', val as UserSettings['theme'])
                    }
                >
                    <SelectTrigger
                        className='max-w-full'
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {THEME_OPTIONS.map(({ Icon, value }) => (
                            <SelectItem key={value} value={value}>
                                <div className='!flex !flex-row items-center gap-x-2'>
                                    <Icon size={16} />
                                    <span className='capitalize'>{value}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <label className='text-sm font-medium'>Open Designs in New Tab</label>
                    <p className='text-xs text-muted-foreground'>designs opened in the browser will always open in a new tab </p>
                </div>
                <Switch
                    checked={formValues.openDesignsInNewTab}
                    onCheckedChange={(val) => handleChange('openDesignsInNewTab', val)}
                />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <label className='text-sm font-medium'>
                        Reduced Motion
                    </label>
                    <p className='text-xs text-muted-foreground'>
                        turn off the animations across the site
                    </p>
                </div>
                <Switch
                    checked={formValues.reducedMotion}
                    onCheckedChange={(val) => handleChange('reducedMotion', val)}
                />
            </div>
            <Divider />
            <div className='mb-3'>
                <h3 className='text-lg font-medium mb-1.5'>
                    Editor Settings
                </h3>
                <p className='text-sm text-muted-foreground'>change the editor defaults to match your preferences</p>
            </div>
            {/* Export Format */}
            <div className="space-y-2">
                <label className='text-sm text-muted-foreground'>Default Export Format</label>
                <Select
                    value={formValues.defaultExportFormat}
                    onValueChange={(val) =>
                        handleChange('defaultExportFormat', val as UserSettings['defaultExportFormat'])
                    }
                >
                    <SelectTrigger
                        className='max-w-full'
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {EXPORT_FORMATS.map((format) => (
                            <SelectItem key={format} value={format}>
                                {format.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='grid grid-cols-2 gap-x-4 gap-y-5'>

                {/* Width */}
                <div className="space-y-2">
                    <label className='text-sm text-muted-foreground'>Default Width</label>
                    <Input
                        type="number"
                        min={100}
                        max={10000}
                        className='max-w-xl'
                        value={formValues.defaultWidth}
                        onChange={(e) => handleChange('defaultWidth', parseInt(e.target.value))}
                    />
                </div>

                {/* Height */}
                <div className="space-y-2">
                    <label className='text-sm text-muted-foreground'>Default Height</label>
                    <Input
                        type="number"
                        min={100}
                        max={10000}
                        className='max-w-xl'
                        value={formValues.defaultHeight}
                        onChange={(e) => handleChange('defaultHeight', parseInt(e.target.value))}
                    />
                </div>
            </div>

            {/* Grid Enabled */}
            <div className="flex items-end justify-between">
                <div>
                    <label className='text-sm font-medium'>Grid Enabled</label>
                    <p className='text-xs text-muted-foreground'>when disabled it removes the grid options in the settings panel</p>
                </div>
                <Switch
                    checked={formValues.gridEnabled}
                    onCheckedChange={(val) => handleChange('gridEnabled', val)}
                />
            </div>
            <Divider />
            <div className='mb-3'>
                <h3 className='mb-1.5'>
                    <span className='text-lg font-medium'>Editor Layout</span>
                </h3>
                <p className='text-sm text-muted-foreground'>customize the editors layout to your liking</p>
            </div>
            {/* Layout Settings */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                {([
                    ['layersPanel', LAYOUT_POSITIONS],
                    ['settingsPanel', LAYOUT_POSITIONS],
                    ['zoomControls', ZOOM_CONTROLS],
                    ['aiPanel', ZOOM_CONTROLS],
                ] as const).map(([key, options]) => (
                    <div key={key} className="space-y-2">
                        <label className="capitalize text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <Select
                            value={formValues.layout[key]}
                            onValueChange={(val) =>
                                handleLayoutChange(key, val as UserSettings['layout'][typeof key])
                            }
                        >
                            <SelectTrigger
                                className='max-w-xl'
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>

            <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
        </div>
    );
}
