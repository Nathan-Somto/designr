import {
    Trash,
    Undo2,
    Redo2,
    Copy,
    ClipboardPaste,
    Group,
    Ungroup,
    CopyPlus,
    SendToBack,
    BringToFront,
    MousePointer2,
} from 'lucide-react'

export const shortcutGroups = [
    {
        title: 'Actions',
        items: [
            {
                label: 'Delete',
                command: 'Backspace / Delete',
                Icon: Trash,
            },
            {
                label: 'Copy',
                command: 'Ctrl + C',
                Icon: Copy,
            },
            {
                label: 'Paste',
                command: 'Ctrl + V',
                Icon: ClipboardPaste,
            },
            {
                label: 'Duplicate',
                command: 'Ctrl + D',
                Icon: CopyPlus,
            },
            {
                label: 'Select All',
                command: 'Ctrl + A',
                Icon: MousePointer2,
            },
        ],
    },
    {
        title: 'Layering',
        items: [
            {
                label: 'Group',
                command: 'Ctrl + G',
                Icon: Group,
            },
            {
                label: 'Ungroup',
                command: 'Ctrl + U',
                Icon: Ungroup,
            },
            {
                label: 'Send to Back',
                command: 'Ctrl + B',
                Icon: SendToBack,
            },
            {
                label: 'Bring to Front',
                command: 'Ctrl + F',
                Icon: BringToFront,
            },
        ],
    },
] as const
