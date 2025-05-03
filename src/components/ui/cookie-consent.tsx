
import React, { useState } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Cookie } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function CookieConsent() {
  const { isOpen, setIsOpen, acceptAll, declineAll, acceptSelected } = useCookieConsent();
  const [isMobileSheet, setIsMobileSheet] = useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileSheet(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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

  // Mobile version using Sheet
  if (isMobileSheet) {
    return (
      <>
        {isOpen && (
          <div className="fixed bottom-0 left-0 right-0 bg-background z-50 p-4 shadow-lg border-t">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-medium">Cookie Preferences</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience and analyze our traffic.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={declineAll} size="sm">
                  Essential Only
                </Button>
                <Button onClick={acceptAll} size="sm">
                  Accept All
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs w-full text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                Customize Settings
              </Button>
            </div>
          </div>
        )}
        
        <Sheet open={!isOpen && isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Settings
              </SheetTitle>
              <SheetDescription>
                Choose which cookies you want to allow on our site.
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-4 space-y-4 max-h-[calc(80vh-150px)] overflow-y-auto">
              <div className="flex items-start space-x-2">
                <Checkbox id="essential-mobile" checked disabled />
                <div className="grid gap-1 leading-none">
                  <Label htmlFor="essential-mobile" className="text-sm font-medium">
                    Essential Cookies
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    These cookies are necessary for the website to function and cannot be switched off.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="preferences-mobile" 
                  checked={settings.preferences}
                  onCheckedChange={(checked) => 
                    handleSettingChange('preferences', checked === true)
                  }
                />
                <div className="grid gap-1 leading-none">
                  <Label htmlFor="preferences-mobile" className="text-sm font-medium">
                    Preferences Cookies
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    These cookies allow the website to remember your preferences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="analytics-mobile" 
                  checked={settings.analytics}
                  onCheckedChange={(checked) => 
                    handleSettingChange('analytics', checked === true)
                  }
                />
                <div className="grid gap-1 leading-none">
                  <Label htmlFor="analytics-mobile" className="text-sm font-medium">
                    Analytics Cookies
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                </div>
              </div>
            </div>
            
            <SheetFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={declineAll} className="w-full">
                Essential Only
              </Button>
              <Button variant="outline" onClick={handleCustomize} className="w-full">
                Save Preferences
              </Button>
              <Button onClick={acceptAll} className="w-full">
                Accept All
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop version using Dialog
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-background rounded-xl shadow-lg z-50 border p-5 hidden md:block">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Cookie Preferences</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We use cookies to enhance your browsing experience and analyze our traffic.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={declineAll} size="sm">
              Essential Only
            </Button>
            <Button onClick={acceptAll} size="sm">
              Accept All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)} 
              className="col-span-2 text-xs text-muted-foreground"
            >
              Customize Settings
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!isOpen && isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookies you want to allow on our site.
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
