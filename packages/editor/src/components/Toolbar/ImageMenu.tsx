import React from 'react'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent } from '@repo/ui/components/dropdown-menu'
import { image } from './data'
import { useCanvas } from '@/hooks/useCanvas'
import { MenuProps } from './types'
import { useImageStore } from '@/hooks/useImage'
import * as fabric from 'fabric'
import { UploadedImage } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { insertElement } from './utils'
export default function ImageMenu({ isActiveAction }: Pick<MenuProps, 'isActiveAction'>) {
    const { updateAction, canvas } = useCanvas();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { onUploadImage, toggleSidebar, setUploading, isUploading, setUploadedImages, uploadedImages } = useImageStore();
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        // only png, jpeg, jpg and svg files are allowed
        const regex = /(png|jpeg|jpg|svg)$/i;
        if (!regex.test(files[0].type)) {
            //TODO: replace with toast library
            alert('Please upload a valid image file');
            return;
        }
        // read image as data url
        /*  const fileReader = new FileReader();
           fileReader.readAsDataURL(files[0]);
          fileReader.onload = () => {
              handleImageAction('Upload', fileReader.result as string, files[0]);
          } */
        const url = URL.createObjectURL(files[0]);
        await handleImageAction('Upload', url, files[0]);


    }
    const handleImageAction = async (action: string, imgURL?: string, imageFile?: File) => {
        if (!canvas) return;
        if (isUploading) return;

        try {
            if (action === 'Upload') {
                console.log("imageURL", imgURL)
                // open image from file system
                //TODO: change url value to null after development
                // eslint-disable-next-line prefer-const
                let uploadedImage: UploadedImage | null = {
                    id: uuidv4(),
                    url: imgURL ?? 'https://via.placeholder.com/150'
                };
                console.log('uploaded image url: ', uploadedImage?.url)
                // call the upload image callback
                //Todo: uncomment line when done with development
                /* if (onUploadImage && imageFile) {
                    setUploading(true);
                    uploadedImage = await onUploadImage(imageFile)
                } */
                if (uploadedImage !== null) {
                    setUploadedImages([...uploadedImages, uploadedImage])
                    const point = canvas.getCenterPoint();
                    const createdImage = document.createElement('img');
                    createdImage.src = uploadedImage.url
                    console.log("created img", createdImage)
                    // preserve aspect ratio
                    const fabricImage = await fabric.FabricImage.fromURL(uploadedImage.url, {

                    },
                        {
                            left: point.x,
                            top: point.y,
                            originX: 'center',
                            originY: 'center'
                        }
                    )
                    // put the image in the canvas
                    insertElement(canvas, fabricImage);


                }

            }
            else {
                // open the image side bar
                toggleSidebar()
            }
            updateAction('Image')
        }
        catch (err) {
            console.log(err);
        }
        finally {

            setUploading(false);

        }
    }
    return (
        <>

            {isUploading && <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center'>
                <div className='bg-white p-4 rounded-md'>
                    <p>Uploading Image...</p>
                </div>
            </div>}
            <DropdownMenu>
                <DropdownMenuTrigger className={`flex h-10 w-10 items-center justify-center gap-1 rounded-md transition-transform duration-200 hover:bg-blue-200 ${isActiveAction('Image') ? 'bg-blue-200 scale-110 text-white' : 'text-black'}`}>
                    {image['Icon']()}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {image['options'].map(({ label, Icon, action }) => (
                        <DropdownMenuItem
                            key={label}
                            onClick={() => action === 'Upload' ? inputRef.current?.click() : handleImageAction(action)}
                            className='gap-x-2'
                        >
                            <Icon />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <input type="file" className='hidden' ref={inputRef} onChange={onFileChange} />
        </>
    )
}
