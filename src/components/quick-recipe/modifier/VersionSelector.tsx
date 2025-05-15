
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
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
  if (!versions || versions.length === 0) {
    return null;
  }

  // Sort versions by version number (descending)
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recipe Versions</h3>
        <span className="text-xs text-muted-foreground">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Select 
        value={selectedVersionId || undefined}
        onValueChange={onSelectVersion}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {sortedVersions.map((version) => (
            <SelectItem key={version.version_id} value={version.version_id}>
              <div className="flex flex-col">
                <span>Version {version.version_number}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedVersionId && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Modification:</span>{' '}
          {versions.find(v => v.version_id === selectedVersionId)?.modification_request || 'Original recipe'}
        </div>
      )}
    </div>
  );
};
