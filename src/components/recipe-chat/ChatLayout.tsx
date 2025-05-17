
import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
