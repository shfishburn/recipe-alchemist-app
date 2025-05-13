
import React from 'react';

interface PreviewHeaderProps {
  toggleDebugMode: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = () => {
  return (
    <div className="flex justify-center items-center">
      <h1 className="text-2xl font-bold text-center">
        Recipe Preview
      </h1>
    </div>
  );
};
