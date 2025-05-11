
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ModificationStatus } from '@/hooks/recipe-modifications';

interface StatusDisplayProps {
  status: ModificationStatus;
  error: string | null;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, error }) => {
  if (status === 'error' && error) {
    return <Badge variant="destructive">Error: {error}</Badge>;
  }

  if (status === 'not-deployed' && error) {
    return <Badge variant="destructive">Service Not Deployed: {error}</Badge>;
  }

  if (status === 'canceled') {
    return <Badge variant="secondary">Request Canceled</Badge>;
  }

  return null;
};
