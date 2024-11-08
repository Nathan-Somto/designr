// a zustand hook for regsitering the upload image callback, loading unsplash images callback, opening the images sidebar
import { UploadedImage } from '@/types';
import { create } from 'zustand';

export type ImageStore = {
  
  isUploading: boolean;
  isSidebarOpen: boolean;
  uploadedImages: UploadedImage[];

  // callbacks
  onUploadImage?: (file: File) => Promise<UploadedImage>;
  onLoadUnsplashImages?: () => Promise<string[]>;
  onDeleteUploadedImage?: (id: string) => void;
  getUploadedImages?: (id: string) => Promise<UploadedImage[]>;
  //setters
  setUploading: (status: boolean) => void;
  setUploadedImages: (images: UploadedImage[]) => void;
  toggleSidebar: () => void;

 
  initialize: (callbacks: {
    onUploadImage: (file: File) => Promise<UploadedImage>;
    onLoadUnsplashImages: () => Promise<string[]>;
  }) => void;
};


export const useImageStore = create<ImageStore>((set) => ({
  isUploading: false,
  isSidebarOpen: false,
  uploadedImages: [],

  setUploading: (status) => set({ isUploading: status }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setUploadedImages: (images) => set({ uploadedImages: images }),

  initialize: ({ onUploadImage, onLoadUnsplashImages }) => {
    set({
      onUploadImage,
      onLoadUnsplashImages,
    });
  },
}));
