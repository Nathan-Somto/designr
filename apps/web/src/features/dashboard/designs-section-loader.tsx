import { Loader } from 'lucide-react'
import React from 'react'

export default function DesignsSectionLoader() {

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">
                Recent designs
            </h3>
            <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        </div>
    )

}
