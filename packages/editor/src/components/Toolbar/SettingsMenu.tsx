import React from 'react'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent } from '@repo/ui/components/ui/dropdown-menu'
import ActionLabel from '@repo/ui/components/ui/hint'
import { settingsMenu } from './data'
import KeyboardShortcutsDialog from '../Dialogs/KeyboardShortcuts'
import { Switch } from '@repo/ui/components/ui/switch'
import { useWorkspace } from '@/hooks/useWorkspace'
function SettingsMenu() {
    const setShowSettings = useWorkspace(state => state.setShowSettings);
    const [isDarkMode, setIsDarkMode] = React.useState(false)
    React.useEffect(() => {
        // set isDarkMode to true if dark classList is present in the body
        const body = document.body;
        if (body.classList.contains('dark')) {
            setIsDarkMode(true);
        }
    }, [])
    const [open, setOpen] = React.useState(false)
    function handleSetOpen(val: boolean) {
        setOpen(val)
    }
    function handleAction(action: typeof settingsMenu['options'][number]['action']) {
        switch (action) {
            case 'Keyboard':
                handleSetOpen(true);
                break;
            case 'Workspace':
                setShowSettings(true);
                break;
            default:
                break;
        }
    }
    function handleThemeToggle(value: boolean) {
        // change the theme here by adding dark classList to the body
        const body = document.body;
        if (value) {
            body.classList.add('dark');
        }
        else {
            body.classList.remove('dark');
        }
        setIsDarkMode(value);
    }
    return (
        <>
            <DropdownMenu>
                <ActionLabel label={settingsMenu.label}>
                    <DropdownMenuTrigger asChild>
                        <button className="flex h-10 text-[15px] px-2 items-center justify-center gap-1.5 rounded-md transition-transform duration-200 hover:bg-blue-200 text-black">
                            {settingsMenu.Icon()}
                        </button>
                    </DropdownMenuTrigger>
                </ActionLabel>
                <DropdownMenuContent className='min-w-28 px-4 py-3' align='end'>
                    {settingsMenu.options.map(({ label, Icon, action, type }) => {
                        if (type === 'toggle') {
                            return <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                            }}>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2 mr-2'>
                                        {Icon()}
                                        <span>{label}</span>
                                    </div>
                                    <Switch checked={isDarkMode} onCheckedChange={(value) => handleThemeToggle(value)} />
                                </div>
                            </DropdownMenuItem>
                        }
                        else {
                            return <DropdownMenuItem
                                key={label}
                                onClick={() => handleAction(action)}
                            >
                                {Icon()}
                                <span>{label}</span>
                            </DropdownMenuItem>
                        }
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <KeyboardShortcutsDialog open={open} setOpen={handleSetOpen} />
        </>
    )
}

export default SettingsMenu