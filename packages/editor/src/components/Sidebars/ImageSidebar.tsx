import { useCanvas } from "@/hooks/useCanvas";
import { useImageStore } from "@/hooks/useImage";
import { cn } from "@repo/ui/lib/utils";
import { useState, useEffect } from "react";
import { TrashIcon, XIcon } from "lucide-react";
import * as fabric from "fabric";
import { insertElement } from "../Toolbar/utils";
function ImageSidebar() {
  const { canvas, updateAction } = useCanvas();
  const {
    isSidebarOpen,
    uploadedImages,
    onDeleteUploadedImage,
    onLoadUnsplashImages,
    toggleSidebar,
  } = useImageStore();

  const [activeTab, setActiveTab] = useState<"uploaded" | "unsplash">("uploaded");
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === "unsplash" && unsplashImages.length === 0) {
      // Load images from unsplash on mount
      const loadImages = async () => {
        if(!onLoadUnsplashImages){
            return;
        }
        const images = await onLoadUnsplashImages();
        setUnsplashImages(images);
      };
      loadImages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleImageClick = async (image: string) => {
    if (canvas) {
        const point = canvas.getCenterPoint();
        const fabricImage = await fabric.FabricImage.fromURL(image, {
        }, {
            left: point.x,
            top: point.y,
        })
        // put the image in the 
        insertElement(canvas, fabricImage);

      };
    }

  const handleDeleteImage = (imageId: string) => {
    if(!onDeleteUploadedImage){
        return;
    }
    onDeleteUploadedImage(imageId);
    // remove from canvas if present
    //Todo: find how to identify an image and remove from canvas
   /*  if (canvas) {
      const fabricImage = canvas.getObjects().find((obj) => obj instanceof fabric.FabricImage && obj.ge === imageId);
      if (fabricImage) {
        canvas.remove(fabricImage);
      }
    } */
  };

  const onClose = () => {
    toggleSidebar();
    updateAction("Select");
  };

  return (
    <aside
      className={cn(
        isSidebarOpen ? "block" : "hidden",
        "fixed left-0 top-[100px] w-72 h-[calc(100vh-100px)] rounded-[8px] bg-panel text-panel-foreground shadow-[0_4px_8px_rgba(0, 0, 0, 0.1)] z-[1000]"
      )}
    >
      <div className="flex justify-between items-center px-4  py-5 border-b border-neutral-300">
        <div>
        <h2 className="text-lg font-semibold">Image Library</h2>
        <p className="text-sm opacity-80">Beautify your design with images</p>
        </div>
      </div>
        <button onClick={onClose} className="text-gray-500 absolute top-2 right-2 hover:text-gray-300">
          <XIcon className="w-5 h-5" />
        </button>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-300">
        <button
          className={cn(
            "w-1/2 py-2 text-center",
            activeTab === "uploaded" ? "bg-neutral-500 text-gray-300" : "bg-neutral-300 text-gray-600"
          )}
          onClick={() => setActiveTab("uploaded")}
        >
          Uploaded
        </button>
        <button
          className={cn(
            "w-1/2 py-2 text-center",
            activeTab === "unsplash" ? "bg-neutral-500 text-gray-300" : "bg-neutral-300 text-gray-600"
          )}
          onClick={() => setActiveTab("unsplash")}
        >
          Unsplash
        </button>
      </div>

      {/* Image Grid */}
      <div className="p-4 overflow-y-auto h-full">
        {activeTab === "uploaded" ? (
          <>
            {uploadedImages.length === 0 ? (
              <p className="text-center text-gray-400 tex-sm">No uploaded images. Please upload some.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      onClick={() => handleImageClick(image.url)}
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-gray-700 text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {unsplashImages.length === 0 ? (
              <p className="text-center text-gray-400">Loading Unsplash images...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {unsplashImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Unsplash"
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default ImageSidebar;
