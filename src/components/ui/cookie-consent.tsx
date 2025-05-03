
import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const { isOpen, setIsOpen, acceptAll, declineAll, acceptSelected } = useCookieConsent();
  
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

  return (
    <>
      {/* Banner for smaller screens */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 sm:p-6 z-50 shadow-lg md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Cookie Preferences</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={declineAll} size="sm" className="w-full">
              Essential Only
            </Button>
            <Button onClick={acceptAll} size="sm" className="w-full">
              Accept All
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setIsOpen(false)} 
              className="w-full"
            >
              Customize
            </Button>
          </div>
        </div>
      )}

      {/* Dialog for larger screens */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] hidden md:block">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              We use cookies to enhance your experience on our site. Please let us know which cookies you're ok with.
            </DialogDescription>
          </DialogHeader>
          
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
          
          <DialogFooter>
            <Button variant="outline" onClick={declineAll}>
              Essential Only
            </Button>
            <Button variant="outline" onClick={handleCustomize}>
              Save Preferences
            </Button>
            <Button onClick={acceptAll}>
              Accept All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
