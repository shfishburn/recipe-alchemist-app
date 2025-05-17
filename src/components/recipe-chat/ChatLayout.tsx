
import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative hw-boost">
      {children}
    </div>
  );
}
