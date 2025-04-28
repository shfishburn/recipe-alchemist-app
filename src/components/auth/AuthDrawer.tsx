
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FocusTrap from "@/components/ui/focus-trap";

// For desktop
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

// For mobile
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import AuthForm from "@/components/auth/AuthForm";

interface AuthDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthDrawer({ open, setOpen }: AuthDrawerProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Close drawer and navigate on successful auth
  const handleAuthSuccess = () => {
    setOpen(false);
    navigate("/"); // Navigate to home page after successful auth
  };

  // If user is already authenticated, close drawer
  useEffect(() => {
    if (session && open) {
      setOpen(false);
    }
  }, [session, open, setOpen]);

  // Focus the close button when drawer opens
  useEffect(() => {
    if (open && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle keyboard events for the drawer/sheet
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Handle click events inside drawer to prevent form submission issues
  const handleContentClick = (e: React.MouseEvent) => {
    // This prevents click events in the drawer content from bubbling up
    e.stopPropagation();
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} onKeyDown={handleKeyDown}>
        <DrawerContent className="min-h-[85vh] pt-4">
          <FocusTrap active={open}>
            <div>
              <DrawerHeader className="flex items-center justify-between border-b pb-4">
                <DrawerTitle className="text-center">Account</DrawerTitle>
                <DrawerClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    ref={closeButtonRef}
                    aria-label="Close authentication drawer"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div 
                className="p-6" 
                onClick={handleContentClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-drawer-title"
              >
                <AuthForm onSuccess={handleAuthSuccess} />
              </div>
            </div>
          </FocusTrap>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full max-w-md border-l" onClick={handleContentClick} onKeyDown={handleKeyDown}>
        <FocusTrap active={open}>
          <div>
            <SheetHeader className="flex items-center justify-between border-b pb-4">
              <SheetTitle id="auth-sheet-title">Account</SheetTitle>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  ref={closeButtonRef}
                  aria-label="Close authentication sheet"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-6">
              <AuthForm onSuccess={handleAuthSuccess} />
            </div>
          </div>
        </FocusTrap>
      </SheetContent>
    </Sheet>
  );
}
