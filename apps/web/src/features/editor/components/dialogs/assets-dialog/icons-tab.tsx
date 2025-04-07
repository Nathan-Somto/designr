/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@designr/ui/components/input'
import { Button } from '@designr/ui/components/button'
import { renderToStaticMarkup } from 'react-dom/server'
import Hint from '@designr/ui/components/hint'

const initialIconNames = [
    'Activity',
    'Airplay',
    'AlarmClock',
    'Archive',
    'Award',
    'Bell',
    'Book',
    'Camera',
    'Calendar',
    'CheckCircle',
    'CheckSquare',
    'ChevronDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronUp',
    'Clipboard',
    'Clock',
]

export function IconsTab({ onSelect }: { onSelect: (svg: string) => void }) {
    const [search, setSearch] = useState('')
    const [iconNames, setIconNames] = useState(initialIconNames)
    const [iconsMap, setIconsMap] = useState<Record<string, React.ElementType>>({})
    const [loading, setLoading] = useState(false)
    const [activeIcon, setActiveIcon] = useState<string | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!search.trim()) {
                setIconNames(initialIconNames)
                return
            }

            import('lucide-react').then((mod) => {
                const matches = Object.keys(mod).filter((name) =>
                    name.toLowerCase().includes(search.toLowerCase()) && !name.endsWith('Icon') && !name.startsWith('Lucide')
                )
                setIconNames(matches.slice(0, 10))
            })
        }, 300)

        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => {
        let isMounted = true

        const loadIcons = async () => {
            setLoading(true)
            const mod = await import('lucide-react')
            const newIcons: Record<string, React.ElementType> = {}

            for (const name of iconNames) {
                if (!iconsMap[name] && mod[name as keyof typeof mod]) {
                    newIcons[name] = mod[name as keyof typeof mod] as React.ElementType
                }
            }

            if (isMounted) {
                setIconsMap((prev) => ({ ...prev, ...newIcons }))
                setLoading(false)
            }
        }

        loadIcons()

        return () => {
            isMounted = false
        }
    }, [iconNames])

    const handleClick = async (name: string) => {
        setActiveIcon(name)
        const mod = await import('lucide-react')
        const Icon = mod[name as keyof typeof mod] as unknown as React.ReactNode
        const svg = renderToStaticMarkup(Icon)
        onSelect(svg)
        setActiveIcon(null)
    }

    return (
        <div className="space-y-4 py-6">
            <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-5 gap-3 mt-7">
                {
                    iconNames.length === 0 && (
                        <div className="col-span-5">
                            <p className="text-center text-muted">No icons found</p>
                        </div>
                    )
                }
                {iconNames.map((name) => {
                    const Icon = iconsMap[name]
                    return (
                        <Hint key={name} label={name} className='z-[600000000000000]'>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center w-full h-16 rounded-md border"
                                onClick={() => handleClick(name)}
                            >
                                {activeIcon === name ? (
                                    <div className="w-6 h-6 rounded-full animate-spin border-2 border-muted border-t-transparent" />
                                ) : Icon && !loading ? (
                                    <Icon className="w-6 h-6" />
                                ) : (
                                    <div className="w-6 h-6 bg-muted animate-pulse rounded" />
                                )}
                            </Button>
                        </Hint>
                    )
                })}
            </div>
        </div>
    )
}
