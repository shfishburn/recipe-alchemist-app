
import React from 'react';
import { Outlet } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function Shell() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingIndicator />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
