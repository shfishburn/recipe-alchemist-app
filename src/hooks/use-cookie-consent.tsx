
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface CookieSettings {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
}

interface CookieConsentContextType {
  hasConsented: boolean;
  cookieSettings: CookieSettings;
  acceptAll: () => void;
  acceptSelected: (settings: CookieSettings) => void;
  declineAll: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
  hasConsented: false,
  cookieSettings: { essential: true, preferences: false, analytics: false },
  acceptAll: () => {},
  acceptSelected: () => {},
  declineAll: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

// Cookie related helper functions - consolidated with common domain/path settings
export const setCookie = (name: string, value: string, days: number = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    essential: true, // Essential cookies are always enabled
    preferences: false,
    analytics: false,
  });
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();

  // Check for existing consent on component mount only (not on route change)
  useEffect(() => {
    if (initialized) return;

    const consentCookie = getCookie('cookieConsent');
    if (consentCookie) {
      setHasConsented(true);
      try {
        const savedSettings = JSON.parse(consentCookie);
        setCookieSettings(savedSettings);
      } catch (e) {
        console.error('Error parsing cookie consent settings', e);
      }
      setIsOpen(false);
    } else {
      // If no consent cookie exists, show the banner
      setIsOpen(true);
    }
    
    setInitialized(true);
  }, [initialized]);

  // Function to save consent settings
  const saveConsent = (settings: CookieSettings) => {
    setHasConsented(true);
    setCookieSettings(settings);
    setCookie('cookieConsent', JSON.stringify(settings));
    setIsOpen(false);
  };

  const acceptAll = () => {
    const allSettings: CookieSettings = {
      essential: true,
      preferences: true,
      analytics: true,
    };
    saveConsent(allSettings);
  };

  const acceptSelected = (settings: CookieSettings) => {
    // Ensure essential cookies are always enabled
    const updatedSettings = { ...settings, essential: true };
    saveConsent(updatedSettings);
  };

  const declineAll = () => {
    const essentialOnly: CookieSettings = {
      essential: true,
      preferences: false,
      analytics: false,
    };
    saveConsent(essentialOnly);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        cookieSettings,
        acceptAll,
        acceptSelected,
        declineAll,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext);
