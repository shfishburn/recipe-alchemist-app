
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useMemo } from "react";
import { RadixWrapper } from "@/components/ui/radix-wrapper";

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
  
  // Close drawer and navigate on successful auth
  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    navigate("/"); // Navigate to home page after successful auth
  }, [setOpen, navigate]);

  // If user is already authenticated, close drawer
  useEffect(() => {
    if (session && open) {
      setOpen(false);
    }
  }, [session, open, setOpen]);

  // Memoize the auth form to prevent unnecessary rerenders
  const authForm = useMemo(() => (
    <AuthForm onSuccess={handleAuthSuccess} />
  ), [handleAuthSuccess]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex items-center justify-between border-b pb-4">
            <DrawerTitle className="text-center">Account</DrawerTitle>
            <DrawerClose asChild>
              <RadixWrapper>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </RadixWrapper>
            </DrawerClose>
          </DrawerHeader>
          <ScrollArea className="p-6 h-full max-h-[70vh]">
            {authForm}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full max-w-md border-l">
        <SheetHeader className="flex items-center justify-between border-b pb-4">
          <SheetTitle>Account</SheetTitle>
          <SheetClose asChild>
            <RadixWrapper>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </RadixWrapper>
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6 h-full">
          {authForm}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
