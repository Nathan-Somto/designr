import TemplateGrid from '#/features/community/template-grid'
import { TemplatesFilter } from '#/features/community/templates-filter'
import { getCommunityProjects } from '#/services/projects'
import React from 'react'
//Todo: implement pagination
export default async function CommunityPage() {
    const data = await getCommunityProjects();
    return (
        <>
            <TemplatesFilter />
            <TemplateGrid
                data={data}
            />
        </>
    )
}
