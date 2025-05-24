import DashboardBanner from '#/features/dashboard/banner'
import EditorPresetsList from '#/features/dashboard/editor-preset-list'
import DesignsSection from '#/features/dashboard/designs-section'
import React, { Suspense } from 'react'
import { promiseCatch } from '#/utils/promise-catch'
import { fetchProjects } from '#/services/projects'
import { UserDesignsData } from '#/hooks/useProjects'
import DesignsSectionLoader from '#/features/dashboard/designs-section-loader'
import { PaginatedResponse } from '#/services'

export default function DashboardPage() {
    const fetchDesignsPromise = promiseCatch(fetchProjects('mine'))
    return (
        <>
            <section id="dashboard__home-section" className='min-h-screen px-6 py-2'>
                <DashboardBanner />
                <EditorPresetsList />
                <div className='mt-14' />
                <Suspense
                    fallback={
                        <DesignsSectionLoader />
                    }
                >
                    <DesignsSection
                        fetchDesignsPromise={fetchDesignsPromise as Promise<PaginatedResponse<UserDesignsData>>}
                    />
                </Suspense>
            </section>
        </>
    )
}