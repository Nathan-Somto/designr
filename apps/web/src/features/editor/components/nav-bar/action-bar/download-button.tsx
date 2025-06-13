import { Button } from '@designr/ui/components/button'
import { downloadOptions } from '../data'
import React from 'react'
import DownloadDialog from '../../dialogs/download-dialog'
export default function DownloadButton() {
    const [open, setOpen] = React.useState(false)
    const {
        label,
        Icon,
    } = downloadOptions;
    return (
        <>
            <Button
                id="editor__action-bar__download-button"
                onClick={() => setOpen(true)}
                className='font-medium [&>svg]:!size-3.5 !h-8'
            >
                <Icon />
                {label}
            </Button>
            <DownloadDialog
                openProp={open}
                onOpenChange={setOpen}
            />
        </>

    )
}
