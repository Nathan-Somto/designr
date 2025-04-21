import AppHeader from '#/components/app/app-header'
import TemplateGrid from '#/features/community/template-grid'
import { TemplatesFilter } from '#/features/community/templates-filter'
import React from 'react'

export default function CommunityPage() {
    return (
        <>
            {/* Search through our community curated templates */}
            <TemplatesFilter />
            <TemplateGrid />
        </>
    )
}
