
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  ready?: boolean;
}

export function PageWrapper({ 
  children, 
  className = '',
  isLoading = false,
  ready = true
}: PageWrapperProps) {
  const location = useLocation();
  const [transitionClass, setTransitionClass] = useState(isLoading ? 'loading-page-enter' : 'page-enter');

  // Update transition class on location change or when ready changes
  useEffect(() => {
    // Skip transition if component isn't ready yet
    if (!ready) return;
    
    // Set initial transition class
    setTransitionClass(isLoading ? 'loading-page-enter' : 'page-enter');
    
    // Use requestAnimationFrame to ensure proper class application
    const frame = requestAnimationFrame(() => {
      setTransitionClass(isLoading ? 'loading-page-enter-active' : 'page-enter-active');
    });
    
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, isLoading, ready]);

  return (
    <div 
      className={cn(
        isLoading ? 'loading-page-transition' : 'page-base',
        transitionClass,
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
