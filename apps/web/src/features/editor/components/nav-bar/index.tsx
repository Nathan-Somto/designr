import React from 'react'
import Toolbar from './tool-bar'
import ActionBar from './action-bar'
import FilenameBar from './filename-bar'
import { BaseEditorCompProps } from '../../types'

export default function Navbar({ editor, isSaving = false }: BaseEditorCompProps & {
    isSaving?: boolean
}) {
    return (
        <nav className='w-full px-6 fixed z-[30] top-[20px] inset-x-0 flex items-center justify-between min-h-fit'>
            <Toolbar
                editor={editor}
                isSaving={isSaving}
            />
            <FilenameBar filename='Untitled' />
            <ActionBar />
        </nav>
    )
}
