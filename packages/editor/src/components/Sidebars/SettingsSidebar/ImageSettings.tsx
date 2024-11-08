import React from 'react'
import { SettingsProps } from './types'
import { RenderSelect } from './RenderUtils'
import { filters } from './data'
import * as fabric from 'fabric'
import { createFilter } from './utils'
export default function ImageSettings({selectedObject, handleObjectSelection}: SettingsProps) {
    if(selectedObject?.object.type !== 'image') return null
    const handleChange = (_property: string, value: string | number) => {
        if (!selectedObject) return;
        if(typeof value !== 'string') return;
       const filterEffect = createFilter(value);
       const imageObject = selectedObject.object as fabric.Image;
        imageObject.filters = filterEffect ? [filterEffect] : [];
        imageObject.applyFilters();
        handleObjectSelection(selectedObject.object);
    }
  return (
    <div className=' py-2 px-4'>
    <h3 className='text-sm font-medium mb-3 text-left'>Filters</h3>
        <RenderSelect
        label='Filters'
        options={filters}
        selectedObject={selectedObject}
        selectedObjectProp='filter'
        handleChange={handleChange}
        />
    </div>
  )
}
