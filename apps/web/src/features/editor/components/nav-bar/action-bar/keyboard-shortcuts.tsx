import { Button } from '@designr/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@designr/ui/components/dialog'
import Hint from '@designr/ui/components/hint'
import { KeyboardIcon } from 'lucide-react'
import React from 'react'
import { keyboardShortcuts } from '../data'

export default function KeyboardShortcuts() {
    return (
        <Dialog>
            <Hint label="keyboard shortcuts">
                <DialogTrigger asChild>
                    <Button
                        variant={'selection'}
                        size={'shrink'}
                        id="editor__navbar-keyboard-shortcuts-button"
                    >
                        <KeyboardIcon />
                    </Button>
                </DialogTrigger>
            </Hint>
            <DialogContent className="max-w-md h-[90vh] min-h-[325px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <DialogDescription>Quick  keyboard commands reference for  editing the canvas.</DialogDescription>
                </DialogHeader>
                <ul className="mt-4 space-y-3">
                    {keyboardShortcuts.map((shortcut, index) => (
                        <li key={index} className="flex items-center space-x-3">
                            <shortcut.Icon className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="font-semibold">{shortcut.command}</p>
                                <p className="text-gray-500 text-sm">{shortcut.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    )
}
