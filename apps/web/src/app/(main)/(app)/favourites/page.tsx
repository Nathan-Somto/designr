import TemplateGrid from '#/features/community/template-grid'
import { ExternalProjectsData } from '#/hooks/useProjects';
import { fetchProjects } from '#/services/projects'
import { promiseCatch } from '#/utils/promise-catch';
import React from 'react'

export default async function FavouritesPage() {
    const res = await promiseCatch(fetchProjects('starred'));
    return (
        <TemplateGrid
            error={res?.type === 'error' ? res.message : undefined}
            data={(res?.type === 'success' ? res.data : []) as ExternalProjectsData[]}
            page={res?.type === 'success' ? res.page : 0}
            totalPages={res?.type === 'success' ? res.totalPages : 0}
            type="favourites"
        />
    )
}
