
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  className?: string;
}

const ImageDropzone = ({ onImageSelected, className }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  }, []);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, []);
  
  const processFiles = useCallback((files: FileList) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelected(file);
      }
    }
  }, [onImageSelected]);

  return (
    <div className="space-y-2">
      <Label>Upload a Food Photo</Label>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
        />
        
        {preview ? (
          <div className="relative w-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto max-h-48 rounded-md object-contain" 
            />
            <button 
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF (max. 5MB)
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <div className="flex items-center gap-1 text-xs bg-secondary rounded-full px-3 py-1">
                <Camera className="h-3 w-3" />
                <span>Take photo</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-secondary rounded-full px-3 py-1">
                <Upload className="h-3 w-3" />
                <span>Upload image</span>
              </div>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
