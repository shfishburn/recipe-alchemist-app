
import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Cookie } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function CookieConsent() {
  const { isOpen, setIsOpen, acceptAll, declineAll, acceptSelected } = useCookieConsent();
  const isMobile = useIsMobile();
  
  const [settings, setSettings] = useState({
    essential: true,
    preferences: false,
    analytics: false,
  });

  const handleSettingChange = (key: keyof typeof settings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  };

  const handleCustomize = () => {
    acceptSelected(settings);
  };

  const cookieOptions = (
    <div className="py-4 space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="essential" checked disabled />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="essential" className="text-sm font-medium">
            Essential Cookies
          </Label>
          <p className="text-[13px] text-muted-foreground">
            These cookies are necessary for the website to function and cannot be switched off.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="preferences" 
          checked={settings.preferences}
          onCheckedChange={(checked) => 
            handleSettingChange('preferences', checked === true)
          }
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="preferences" className="text-sm font-medium">
            Preferences Cookies
          </Label>
          <p className="text-[13px] text-muted-foreground">
            These cookies allow the website to remember choices you make (such as your preferred unit system).
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="analytics" 
          checked={settings.analytics}
          onCheckedChange={(checked) => 
            handleSettingChange('analytics', checked === true)
          }
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="analytics" className="text-sm font-medium">
            Analytics Cookies
          </Label>
          <p className="text-[13px] text-muted-foreground">
            These cookies help us understand how visitors interact with our website.
          </p>
        </div>
      </div>
    </div>
  );

  const cookieActions = (
    <>
      <Button variant="outline" onClick={declineAll}>Essential Only</Button>
      <Button variant="outline" onClick={handleCustomize}>Save Preferences</Button>
      <Button onClick={acceptAll}>Accept All</Button>
    </>
  );

  return (
    <>
      {/* Mobile UI - Sheet */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Preferences
              </SheetTitle>
              <SheetDescription>
                We use cookies to enhance your experience on our site. Please let us know which cookies you're ok with.
              </SheetDescription>
            </SheetHeader>
            
            {cookieOptions}
            
            <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
              {cookieActions}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop UI - Dialog */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Preferences
              </DialogTitle>
              <DialogDescription>
                We use cookies to enhance your experience on our site. Please let us know which cookies you're ok with.
              </DialogDescription>
            </DialogHeader>
            
            {cookieOptions}
            
            <DialogFooter>
              {cookieActions}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
