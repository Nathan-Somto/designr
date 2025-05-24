import TemplateGrid from '#/features/community/template-grid'
import { TemplatesFilter } from '#/features/community/templates-filter'
import { ExternalProjectsData } from '#/hooks/useProjects';
import { fetchProjects } from '#/services/projects'
import { promiseCatch } from '#/utils/promise-catch';
import React from 'react'
export default async function CommunityPage() {
    const res = await promiseCatch(fetchProjects('community'));
    return (
        <>
            <TemplatesFilter />
            <TemplateGrid
                error={res?.type === 'error' ? res.message : undefined}
                data={(res?.type === 'success' ? res.data : []) as ExternalProjectsData[]}
                page={res?.type === 'success' ? res.page : 0}
                totalPages={res?.type === 'success' ? res.totalPages : 0}
                type="community"
            />
        </>
    )
}
