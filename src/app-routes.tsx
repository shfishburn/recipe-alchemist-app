import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Index from './pages/Index';
import MaterialShowcase from './pages/MaterialShowcase';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/material-showcase" element={<MaterialShowcase />} />
        {/* Other routes would go here */}
      </Route>
    </Routes>
  );
}
