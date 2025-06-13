import React from 'react'
import { Badge } from '@designr/ui/components/badge'
import { Card, CardContent } from '@designr/ui/components/card'
import { shortcutGroups } from './data';
import { Divider } from '@designr/ui/components/divider';
import { ScrollArea } from '@designr/ui/components/scroll-area';
import { useEditorStore } from '../../hooks/useEditorStore';
interface Props {
    menuRef: React.MutableRefObject<HTMLDivElement | null>
    contextMenuPostion: {
        x: number;
        y: number;
    } | null
}
type Label = typeof shortcutGroups[number]['items'][number]['label']
export default function ContextMenu({
    contextMenuPostion,
    menuRef,
}: Props) {
    const { editor } = useEditorStore();
    const disableButton = React.useCallback((label: Label) => {
        switch (label) {
            case 'Group':
                if (!editor?.selectedObjects?.length) return true
                return editor?.isType(editor?.selectedObjects?.[0]?.object, 'group')
            case 'Paste':
                return editor?.getRefState() === null;
            case 'Ungroup':
                if (!editor?.selectedObjects?.length) return true
                return !editor?.isType(editor?.selectedObjects?.[0]?.object, 'group')
            default:
                return false
        }
    }, [editor])
    const handleClick = (label: Label) => {
        const actions: Record<Label, () => void> = {
            'Group': () => editor?.groupActiveObjects(),
            'Ungroup': () => editor?.ungroupActiveObjects(),
            'Copy': () => editor?.copy(),
            'Paste': () => editor?.paste(),
            'Bring to Front': () => editor?.bringToFront(),
            'Send to Back': () => editor?.sendToBack(),
            'Delete': () => editor?.clearActiveObjects(),
            'Duplicate': () => editor?.duplicateActiveObjects(),
            'Select All': () => editor?.selectAllObjects(),
        };
        actions[label]?.();
    };

    return (
        <Card
            id="editor__context-menu"
            ref={menuRef}
            className={`absolute bottom-4 h-72 shadow-md rounded-md p-2 z-[5000000000] border border-gray-200 ${contextMenuPostion ? 'block' : 'hidden'
                }`}
            style={{
                top: contextMenuPostion?.y,
                left: contextMenuPostion?.x,
            }}
        >
            <CardContent className="!p-0">
                <ScrollArea
                    className='h-72 px-2 py-3.5'
                >
                    {shortcutGroups.map((group, index) => (
                        <div key={group.title}>
                            {index > 0 && <Divider className="my-2" />}
                            {group.items.map(({ Icon, label, command }) => (
                                <button
                                    onClick={() => handleClick(label)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    aria-disabled={disableButton(label)}
                                    disabled={disableButton(label)}
                                    key={command}
                                    className="flex w-full items-center disabled:pointer-events-none disabled:opacity-30 group justify-between hover:bg-accent px-2 py-2 rounded-sm cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{label}</span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs font-mono text-muted-foreground bg-accent group-hover:bg-white hover:bg-white"
                                    >
                                        {command}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
