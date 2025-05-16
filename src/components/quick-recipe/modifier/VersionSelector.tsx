
import React from 'react';
import { format } from 'date-fns';
import { ChevronDown, ClockIcon, HistoryIcon } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { VersionHistoryEntry } from '@/hooks/recipe-modifications/types';

interface VersionSelectorProps {
  versions: VersionHistoryEntry[];
  selectedVersionId: string | null;
  onSelectVersion: (versionId: string) => void;
  currentRecipeId?: string;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  versions,
  selectedVersionId,
  onSelectVersion,
  currentRecipeId
}) => {
  // Defensive check - if no versions, don't render anything
  if (!versions || versions.length === 0) return null;
  
  // Sort versions by version_number to ensure chronological display
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);
  
  // Find selected version data
  const selectedVersion = selectedVersionId 
    ? versions.find(v => v.version_id === selectedVersionId) 
    : sortedVersions[0];

  // Find latest version
  const latestVersion = sortedVersions[0];

  // Determine if current version is the latest
  const isLatestVersion = selectedVersionId === latestVersion?.version_id;
  
  // Format the request text with defensive null checks
  const formatRequestText = (text: string | undefined | null) => {
    if (!text) return "No modification details";
    return text.length > 60 ? `${text.substring(0, 60)}...` : text;
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center">
              <HistoryIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              Recipe Version History
            </CardTitle>
            <CardDescription>
              {versions.length === 1 
                ? "Original version" 
                : `${versions.length} versions available`}
            </CardDescription>
          </div>
          
          {versions.length > 1 && !isLatestVersion && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => latestVersion && onSelectVersion(latestVersion.version_id)}
                  >
                    Latest
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to latest version</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Select
          value={selectedVersionId || undefined}
          onValueChange={onSelectVersion}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a version">
              {selectedVersion && (
                <div className="flex items-center space-x-2">
                  <span>Version {selectedVersion.version_number}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(selectedVersion.created_at), 'MMM d, yyyy')}
                  </span>
                  {isLatestVersion && (
                    <Badge variant="outline" className="ml-2 text-xs">Latest</Badge>
                  )}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          
          <SelectContent>
            <SelectGroup>
              {sortedVersions.map((version) => (
                <SelectItem 
                  key={version.version_id} 
                  value={version.version_id}
                  className="py-3 px-2"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">Version {version.version_number}</span>
                        {version.version_id === latestVersion?.version_id && (
                          <Badge variant="outline" className="ml-2 text-xs">Latest</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {format(new Date(version.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {version.modification_request && (
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        {formatRequestText(version.modification_request)}
                      </p>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
