
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
    <div className="py-4 space-y-6">
      <div className="flex items-start space-x-3">
        <div className="flex h-5 items-center pt-1">
          <Checkbox id="essential" checked disabled className="data-[state=checked]:bg-green-600" />
        </div>
        <div className="ml-1">
          <Label htmlFor="essential" className="text-base font-medium">
            Essential Cookies
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            These cookies are necessary for the website to function and cannot be switched off.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <div className="flex h-5 items-center pt-1">
          <Checkbox 
            id="preferences" 
            checked={settings.preferences}
            onCheckedChange={(checked) => 
              handleSettingChange('preferences', checked === true)
            }
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="ml-1">
          <Label htmlFor="preferences" className="text-base font-medium">
            Preferences Cookies
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            These cookies allow the website to remember choices you make (such as your preferred unit system).
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <div className="flex h-5 items-center pt-1">
          <Checkbox 
            id="analytics" 
            checked={settings.analytics}
            onCheckedChange={(checked) => 
              handleSettingChange('analytics', checked === true)
            }
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="ml-1">
          <Label htmlFor="analytics" className="text-base font-medium">
            Analytics Cookies
          </Label>
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
