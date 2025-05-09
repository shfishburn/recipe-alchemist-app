
import React from 'react';
import { RecipeBatchUpdatePanel } from '@/components/admin/RecipeBatchUpdatePanel';

export function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <RecipeBatchUpdatePanel />
        
        {/* Additional admin panels could be added here in the future */}
      </div>
    </div>
  );
}

export default AdminPage;
