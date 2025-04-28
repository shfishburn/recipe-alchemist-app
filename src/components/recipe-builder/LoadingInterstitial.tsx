
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface LoadingInterstitialProps {
  isOpen: boolean;
}

const LoadingInterstitial = ({ isOpen }: LoadingInterstitialProps) => {
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Creating Your Recipe</h3>
          <p className="text-muted-foreground text-sm">
            Our culinary AI is crafting your perfect recipe...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingInterstitial;
