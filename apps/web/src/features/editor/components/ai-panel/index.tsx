import { useSettings } from '#/features/settings/settings-provider';
import { userSettingsDefaults } from '@designr/db/user-settings';
import { cn } from '@designr/ui/lib/utils';
import React from 'react'
import { EditorLayoutStyles } from '../ui/editor-layout-styles';
import AiButton from '#/features/ai/components/ai-button';

export default function AiPanel() {
    const { settings } = useSettings();
    const key = settings?.layout?.aiPanel ?? userSettingsDefaults?.layout?.zoomControls
    return (
        <section
            id="editor__ai-panel"
            className={cn('h-fit w-fit px-6', EditorLayoutStyles[key])}
        >
            <AiButton
            />
        </section>
    )
}
