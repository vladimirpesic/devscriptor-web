'use client';

import { useState } from 'react';
import { Download, Check, Copy, Terminal, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ReleaseAsset } from '@/lib/github';
import {
  getOSDisplayName,
  getArchDisplayName,
  getInstallInstructions,
} from '@/lib/platform';

interface DownloadCardProps {
  asset: ReleaseAsset;
  isRecommended?: boolean;
  className?: string;
}

export function DownloadCard({
  asset,
  isRecommended = false,
  className,
}: DownloadCardProps) {
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleDownload = () => {
    window.open(asset.url, '_blank');
  };

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const instructions = getInstallInstructions(asset);

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isRecommended && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        className
      )}
    >
      {isRecommended && (
        <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Recommended
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileArchive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">
              {getOSDisplayName(asset.os)}
            </CardTitle>
            <CardDescription className="text-xs">
              {getArchDisplayName(asset.arch, asset.os)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-mono text-xs">{asset.extension} archive</span>
          <span className="text-xs">v{asset.version}</span>
        </div>

        <Button
          onClick={handleDownload}
          className="w-full gap-2"
          size="lg"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>

        <button
          onClick={() => setShowInstallInstructions(!showInstallInstructions)}
          className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Terminal className="h-4 w-4" />
          {showInstallInstructions ? 'Hide' : 'Show'} install instructions
        </button>

        {showInstallInstructions && (
          <div className="space-y-2 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Install via terminal:
            </p>
            <div className="space-y-2">
              {instructions.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    'group flex items-start gap-2 rounded',
                    line.startsWith('#') && 'text-muted-foreground'
                  )}
                >
                  {line.startsWith('#') ? (
                    <span className="text-xs">{line}</span>
                  ) : (
                    <>
                      <code className="flex-1 break-all text-xs font-mono">
                        {line}
                      </code>
                      <button
                        onClick={() => handleCopyCommand(line)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        title="Copy command"
                      >
                        {copiedCommand === line ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
