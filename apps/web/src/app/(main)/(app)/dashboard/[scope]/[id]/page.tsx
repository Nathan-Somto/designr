import AppHeader from '#/components/app/app-header'
import DashboardBanner from '#/features/dashboard/banner'
import EditorPresetsList from '#/features/dashboard/editor-preset-list'
import DesignsSection from '#/features/dashboard/designs-section'
import React from 'react'

export default function DashboardPage() {
    return (
        <>
            <AppHeader />
            <section id="dashboard__home-section" className='min-h-screen px-6 py-2'>
                <DashboardBanner />
                <EditorPresetsList />
                <div className='mt-14' />
                <DesignsSection />
            </section>
        </>
    )
}