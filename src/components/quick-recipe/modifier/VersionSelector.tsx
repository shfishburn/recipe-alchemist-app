
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { VersionHistoryEntry } from '@/hooks/recipe-modifications/types';

interface VersionSelectorProps {
  versions: VersionHistoryEntry[];
  selectedVersionId: string | null;
  onSelectVersion: (versionId: string) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  versions,
  selectedVersionId,
  onSelectVersion
}) => {
  if (!versions.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recipe Version History</CardTitle>
        <CardDescription>View and compare previous versions</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedVersionId || undefined}
          onValueChange={onSelectVersion}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {versions.map((version) => (
                <SelectItem key={version.version_id} value={version.version_id}>
                  Version {version.version_number} - {format(new Date(version.created_at), 'MMM d, yyyy')}{' '}
                  {version.modification_request ? (
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({version.modification_request.substring(0, 30)}
                      {version.modification_request.length > 30 ? '...' : ''})
                    </span>
                  ) : null}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
