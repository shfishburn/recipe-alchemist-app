
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

// Storage key for session storage to prevent multiple prompts
const SESSION_CONSENT_KEY = 'cookieConsentShown';

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    essential: true, // Essential cookies are always enabled
    preferences: false,
    analytics: false,
  });
  
  const location = useLocation();

  // Check for existing consent only once on component mount
  useEffect(() => {
    // Check if consent has already been given
    const consentCookie = getCookie('cookieConsent');
    
    if (consentCookie) {
      try {
        const savedSettings = JSON.parse(consentCookie);
        setHasConsented(true);
        setCookieSettings(savedSettings);
        setIsOpen(false); // Make sure banner stays closed
      } catch (e) {
        console.error('Error parsing cookie consent settings', e);
      }
    } else {
      // Check if we've already shown the consent banner in this session
      const consentShown = sessionStorage.getItem(SESSION_CONSENT_KEY);
      
      if (!consentShown) {
        // If no consent and not shown yet in this session, show after a short delay
        const timer = setTimeout(() => {
          setIsOpen(true);
          // Mark that we've shown the consent banner in this session
          sessionStorage.setItem(SESSION_CONSENT_KEY, 'true');
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Function to save consent settings
  const saveConsent = (settings: CookieSettings) => {
    setHasConsented(true);
    setCookieSettings(settings);
    setCookie('cookieConsent', JSON.stringify(settings));
    setIsOpen(false);
    // Also mark as shown for this session
    sessionStorage.setItem(SESSION_CONSENT_KEY, 'true');
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
