import { CodeIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

export function CompareSlider({ leftImage, rightImage }: { leftImage: string, rightImage: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState(50)

    const handleDrag = (e: React.MouseEvent) => {
        const bounds = containerRef.current?.getBoundingClientRect()
        if (!bounds) return
        const x = ((e.clientX - bounds.left) / bounds.width) * 100
        setPosition(Math.max(0, Math.min(100, x)))
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-56 aspect-square bg-gray-100 overflow-hidden rounded-md cursor-col-resize"
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
            onMouseDown={handleDrag}
        >
            <Image
                fill
                src={leftImage}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
                alt="Before"
            />
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${position}%` }}
            >
                <Image
                    src={rightImage}
                    fill
                    className="w-full h-full object-cover"
                    draggable={false}
                    alt="After"
                />
            </div>
            <div
                className="absolute top-0 bottom-0"
                style={{ left: `${position}%` }}
            >
                <div className="w-1 bg-white h-full shadow-md" />
                <CodeIcon
                    className="absolute top-1/2 left-1/2 bg-white p-2 transform -translate-x-1/2 rounded-full -translate-y-1/2 size-8 text-gray-700"
                    style={{ transform: `translate(-50%, -50%)` }}
                />
            </div>
        </div>
    )
}

export default CompareSlider
