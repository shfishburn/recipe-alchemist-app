
import React from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ModificationStatus } from '@/hooks/recipe-modifications';

interface ModificationRequestProps {
  request: string;
  setRequest: (request: string) => void;
  immediate: boolean;
  setImmediate: (immediate: boolean) => void;
  status: ModificationStatus;
  onRequestModifications: () => void;
  onCancelRequest: () => void;
}

export const ModificationRequest: React.FC<ModificationRequestProps> = ({
  request,
  setRequest,
  immediate,
  setImmediate,
  status,
  onRequestModifications,
  onCancelRequest
}) => {
  const isLoading = status === 'loading';
  const isApplying = status === 'applying';
  const isDisabled = isLoading || isApplying;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Modification Request</CardTitle>
        <CardDescription>Enter your modification request below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="request">Modification Request</Label>
          <Textarea
            id="request"
            placeholder="Make it healthier, reduce carbs, etc."
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            disabled={isDisabled}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="immediate">Immediate</Label>
          <Switch
            id="immediate"
            checked={immediate}
            onCheckedChange={setImmediate}
            disabled={isDisabled}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          onClick={onRequestModifications}
          disabled={isDisabled}
        >
          {isLoading ? 'Loading...' : 'Request Modifications'}
        </Button>
        {isLoading && (
          <Button variant="destructive" onClick={onCancelRequest}>
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
