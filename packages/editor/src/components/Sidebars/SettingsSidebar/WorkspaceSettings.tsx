import React, { useCallback, useRef } from 'react'
import { workspace } from './data'
import { RenderColor, RenderInput, RenderSelect } from './RenderUtils'
import { useCanvas } from '@/hooks/useCanvas'
import { useWorkspace, getWorkspace } from '@/hooks/useWorkspace'
import { FabricObject, FabricObjectProps, ObjectEvents, SerializedObjectProps } from 'fabric'
type WorkSpaceObj = { object: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>, width: number, height: number, dimension: string, fill: string } | undefined
function WorkspaceSettings() {
    const ogDimensions = useRef<string>('')
    const [workspaceObj, setWorkspaceObj] = React.useState<WorkSpaceObj>();
    const { changeWorkspaceBg, changeWorkspaceSize } = useWorkspace()
    const { canvas } = useCanvas();
    const updateWorkspace = useCallback((obj?: WorkSpaceObj) => {
        if(obj){
            setWorkspaceObj(obj);
            return;
        }
        if(!canvas) return;
        const workspace = getWorkspace(canvas);
        if (workspace) {
            ogDimensions.current =`${workspace.width}x${workspace.height}`
            setWorkspaceObj({
                object: workspace,
                width: workspace.width,
                height: workspace.height,
                dimension: `${workspace.width}x${workspace.height}`,
                fill: workspace.fill as string
            })
        }
    }, [canvas])
    React.useEffect(() => {
        if (canvas) {
           updateWorkspace();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas]);
    const handleChange = (property: string, value: string | number) => {
        if (!canvas) return;
        if(!workspaceObj) return;
        if (property === 'width') {
            changeWorkspaceSize(canvas, value as number);
        }
        if (property === 'height') {
            changeWorkspaceSize(canvas, void 0, value as number);
        }
        if (typeof value !== 'string') return;
        if (property === 'dimension') {
            const [width, height] = value.split('x');
            changeWorkspaceSize(canvas, +width, +height);
            updateWorkspace({...workspaceObj, [property]: value, width: +width, height: +height});
            return;
        }
        if (property === 'fill') {
            changeWorkspaceBg(canvas, value);
        }
        updateWorkspace({...workspaceObj, [property]: value})
    }
    if (workspaceObj === undefined) return null;
    console.log("the backgroundColor:", workspaceObj.fill)
    return (
        <div className=' border-y-neutral-400 py-2 px-4'>
            {workspace.colorInputs.map((item) =>
                <RenderColor<Exclude<WorkSpaceObj, undefined>>
                    key={item.label}
                    handleChange={handleChange}
                    selectedObject={workspaceObj}
                    value={workspaceObj['fill']}
                    selectedObjectProp={'fill'}
                    label={item.label}
                    type={item.type as 'string'}
                />)}
            <div className='flex gap-x-2 items-center my-4'>
                {
                    workspace.inputs.map(item => {
                        if(!item?.Icon) return null
                       return <RenderInput<Exclude<WorkSpaceObj, undefined>>
                            key={item.label}
                            handleChange={handleChange}
                            selectedObject={workspaceObj}
                            showLabel={false}
                            Icon={item.Icon as () => JSX.Element}
                            selectedObjectProp={item.workspaceProp}
                            label={item.label}
                            type='float'
                            value={workspaceObj[item.workspaceProp]}
                            width='half'
                        />
})
                }
            </div>
            {
                workspace.selects.map(item => {
                    return <RenderSelect
                    key={item.label}
                    handleChange={handleChange}
                    label={item.label}
                    //@ts-expect-error: fuck off
                    options={item.options.map(item => item.label).concat(`Default (${ogDimensions.current})`)}
                    useCustomValues
                    //@ts-expect-error: fuck off
                    values={item.options.map(item => item.value).concat(`${ogDimensions.current}`)}
                    selectedObject={workspaceObj}
                    selectedObjectProp='dimension'
                    />
                })
            }
        </div>
    )
}


export default WorkspaceSettings