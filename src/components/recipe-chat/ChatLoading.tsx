
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function ChatLoading() {
  return (
    <Card className="border-slate-100">
      <CardContent className="pt-2 sm:pt-6">
        <div className="flex justify-center p-4 sm:p-8">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
