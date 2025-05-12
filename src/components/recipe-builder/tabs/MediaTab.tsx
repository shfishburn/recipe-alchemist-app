
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ImageDropzone from '../ImageDropzone';

interface MediaTabProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageSelected: (file: File) => void;
}

const MediaTab = ({ url, onUrlChange, onImageSelected }: MediaTabProps) => {
  return (
    <div className="space-y-6 pt-4">
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url">Recipe URL (Optional)</Label>
        <Input
          id="url"
          name="url"
          placeholder="Enter a link to a recipe to adapt it"
          value={url}
          onChange={onUrlChange}
        />
      </div>

      {/* Image Upload */}
      <ImageDropzone onImageSelected={onImageSelected} />
    </div>
  );
};

export default MediaTab;
