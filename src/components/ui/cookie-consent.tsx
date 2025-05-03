
import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Check, Cookie } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function CookieConsent() {
  const { isOpen, setIsOpen, acceptAll, declineAll, acceptSelected } = useCookieConsent();
  const isMobile = useIsMobile();
  
  const [settings, setSettings] = useState({
    essential: true,
    preferences: false,
    analytics: false,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    if (key === 'essential') return; // Essential cookies can't be toggled
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCustomize = () => {
    acceptSelected(settings);
  };

  const cookieOptions = (
    <div className="py-4 space-y-4">
      {/* Essential Cookies - Always enabled */}
      <div 
        className={`flex items-start p-3 rounded-md bg-green-50 cursor-not-allowed`}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
          <Check className="h-4 w-4 text-green-600" />
        </div>
        <div className="ml-3">
          <h4 className="text-base font-medium">Essential Cookies</h4>
          <p className="text-sm text-muted-foreground mt-1">
            These cookies are necessary for the website to function and cannot be switched off.
          </p>
        </div>
      </div>
      
      {/* Preferences Cookies */}
      <div 
        className={`flex items-start p-3 rounded-md cursor-pointer transition-colors
          ${settings.preferences ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-muted/50'}`}
        onClick={() => handleSettingChange('preferences')}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
          {settings.preferences && (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </div>
        <div className="ml-3">
          <h4 className="text-base font-medium">Preferences Cookies</h4>
          <p className="text-sm text-muted-foreground mt-1">
            These cookies allow the website to remember choices you make (such as your preferred unit system).
          </p>
        </div>
      </div>
      
      {/* Analytics Cookies */}
      <div 
        className={`flex items-start p-3 rounded-md cursor-pointer transition-colors
          ${settings.analytics ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-muted/50'}`}
        onClick={() => handleSettingChange('analytics')}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
          {settings.analytics && (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </div>
        <div className="ml-3">
          <h4 className="text-base font-medium">Analytics Cookies</h4>
          <p className="text-sm text-muted-foreground mt-1">
            These cookies help us understand how visitors interact with our website.
          </p>
        </div>
      </div>
    </div>
  );

  const cookieActions = (
    <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
      <Button variant="outline" onClick={declineAll} className="flex-1 sm:flex-none py-2">Essential Only</Button>
      <Button variant="outline" onClick={handleCustomize} className="flex-1 sm:flex-none py-2">Save Preferences</Button>
      <Button onClick={acceptAll} className="flex-1 sm:flex-none py-2 bg-green-600 hover:bg-green-700">Accept All</Button>
    </div>
  );

  return (
    <>
      {/* Mobile UI - Sheet */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader className="pb-2">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Cookie className="h-5 w-5" />
                Cookie Preferences
              </SheetTitle>
              <SheetDescription className="text-base">
                We use cookies to enhance your experience on our site. Please let us know which cookies you're ok with.
              </SheetDescription>
            </SheetHeader>
            
            {cookieOptions}
            
            <SheetFooter className="pt-4 border-t">
              {cookieActions}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop UI - Dialog */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] p-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Cookie className="h-5 w-5" />
                Cookie Preferences
              </DialogTitle>
              <DialogDescription className="text-base">
                We use cookies to enhance your experience on our site. Please let us know which cookies you're ok with.
              </DialogDescription>
            </DialogHeader>
            
            {cookieOptions}
            
            <DialogFooter className="pt-4 border-t">
              {cookieActions}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
