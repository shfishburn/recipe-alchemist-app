
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
  onError: () => void;
}

export function ImageDialog({ open, onOpenChange, imageUrl, title, onError }: ImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl" 
        aria-describedby="image-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="image-dialog-description">
            Full image view
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] object-contain rounded-md"
            onError={onError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
