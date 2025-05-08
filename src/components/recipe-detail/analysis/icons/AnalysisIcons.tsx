
import React from 'react';
import { FlaskRound } from "lucide-react";

export function ChemistryIcon() {
  return <FlaskRound className="h-5 w-5 mr-2 text-blue-600" />;
}

export function TechniquesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-600">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
      <path d="m8 12 4 4 4-4"/>
      <path d="M12 8v8"/>
    </svg>
  );
}

export function TroubleshootingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-600">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

export function ReactionIcon() {
  return <FlaskRound className="h-5 w-5 mr-2 text-recipe-blue" />;
}
