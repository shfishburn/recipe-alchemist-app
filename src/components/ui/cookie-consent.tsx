import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Check, Cookie } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function CookieConsent() {
  const { isOpen, setIsOpen, hasConsented, acceptAll, declineAll, acceptSelected } = useCookieConsent();
  const isMobile = useIsMobile();
  
  // Define state hooks BEFORE any conditional returns to maintain consistent hook calls
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
  
  // Only render the component content if user hasn't consented yet and banner should be shown
  if (hasConsented || !isOpen) {
    return null; // Early return after all hooks are defined
  }

  // Simplified options layout
  const cookieOptions = (
    <div className="py-3 space-y-3">
      {/* Essential Cookies - Always enabled */}
      <div className="flex items-center justify-between p-2 rounded-md bg-green-50">
        <div>
          <h4 className="text-sm font-medium">Essential Cookies</h4>
          <p className="text-xs text-muted-foreground">Required for site functionality</p>
        </div>
        <Check className="h-4 w-4 text-green-600" />
      </div>
      
      {/* Other cookie types */}
      {Object.entries(settings)
        .filter(([key]) => key !== 'essential')
        .map(([key, value]) => (
          <div 
            key={key}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${value ? 'bg-green-50' : 'hover:bg-muted/50'}`}
            onClick={() => handleSettingChange(key as keyof typeof settings)}
          >
            <div>
              <h4 className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              <p className="text-xs text-muted-foreground">
                {key === 'preferences' ? 'Remembers your preferences' : 'Helps us improve the site'}
              </p>
            </div>
            {value && <Check className="h-4 w-4 text-green-600" />}
          </div>
        ))}
    </div>
  );

  const cookieActions = (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
      <Button variant="outline" onClick={declineAll} size="sm" className="flex-1 sm:flex-none">Essential Only</Button>
      <Button variant="outline" onClick={handleCustomize} size="sm" className="flex-1 sm:flex-none">Save Preferences</Button>
      <Button onClick={acceptAll} size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">Accept All</Button>
    </div>
  );

  return (
    <>
      {/* Mobile UI - Sheet */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader className="pb-2">
              <SheetTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Settings
              </SheetTitle>
              <SheetDescription className="text-sm">
                We use cookies to enhance your experience
              </SheetDescription>
            </SheetHeader>
            
            {cookieOptions}
            
            <SheetFooter className="pt-3 border-t mt-3">
              {cookieActions}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop UI - Dialog */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[400px] p-4">
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Settings
              </DialogTitle>
              <DialogDescription className="text-sm">
                We use cookies to enhance your experience
              </DialogDescription>
            </DialogHeader>
            
            {cookieOptions}
            
            <DialogFooter className="pt-3 border-t mt-3">
              {cookieActions}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
