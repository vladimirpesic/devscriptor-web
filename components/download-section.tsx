'use client';

import { useEffect, useState } from 'react';
import { Download, ArrowRight, Package, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PRODUCTS, getReleaseInfo, repoUrl, type ProductId } from '@/lib/github';
import {
  detectPlatform,
  getRecommendedAsset,
  getOSDisplayName,
  getArchDisplayName,
  isPlatformSupported,
  type DetectedPlatform,
} from '@/lib/platform';
import { DownloadCard } from './download-card';
import Link from 'next/link';
import { LICENSE_BADGE } from '@/lib/licensing';

interface DownloadSectionProps {
  variant?: 'compact' | 'full';
  /** Which product's archives to show. Defaults to Devscriptor. */
  product?: ProductId;
  className?: string;
}

/** One-line summary of what a product's archive contains. */
const BLURBS: Record<ProductId, React.ReactNode> = {
  devscriptor: (
    <>
      Every archive holds one folder with the license and a single <code>devscriptor</code>
      executable — the CLI, the language-server integration, the Context Graph and the MCP
      server. AI coding agents start the server with <code>devscriptor mcp</code>.
    </>
  ),
  rusta: (
    <>
      Every archive holds one folder with the license and a single <code>rusta</code> executable —
      the agent, the Kimi, GLM, DeepSeek and OpenAI-compatible providers, the MCP client and the
      REPL. Run{' '}
      <code>rusta init</code> to pick a provider and verify your API key, then{' '}
      <code>rusta doctor</code> to check the rest.
    </>
  ),
};

export function DownloadSection({
  variant = 'compact',
  product = 'devscriptor',
  className,
}: DownloadSectionProps) {
  // The release is fixed at build time; only the visitor's platform is
  // detected in the browser, after hydration.
  const release = getReleaseInfo(product);
  const [platform, setPlatform] = useState<DetectedPlatform | null>(null);
  const spec = PRODUCTS[product];

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const recommended = platform
    ? getRecommendedAsset(release.assets, platform.os, platform.arch)
    : null;

  if (variant === 'compact') {
    return (
      <section className={className}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{spec.name}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {release.version}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommended?.asset ? (
                    <>
                      Recommended for your system:{' '}
                      <span className="font-medium text-foreground">
                        {getOSDisplayName(recommended.asset.os)} ({getArchDisplayName(recommended.asset.arch, recommended.asset.os)})
                      </span>
                    </>
                  ) : (
                    'Choose your platform to download'
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Single self-contained binary · {LICENSE_BADGE} ·{' '}
                  <a
                    href={repoUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Source on GitHub
                  </a>
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {recommended?.asset ? (
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => window.open(recommended.asset!.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                    Download for {getOSDisplayName(recommended.asset.os)}
                  </Button>
                ) : (
                  <Link href="/download/">
                    <Button size="lg" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </Link>
                )}
                <Link href="/download/">
                  <Button variant="outline" size="lg" className="gap-2">
                    All Platforms
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    );
  }

  // Full variant - show all downloads
  return (
    <section className={className}>
      <div className="space-y-8">
        {platform && !isPlatformSupported(platform) && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-700 dark:text-yellow-300">
            <p className="text-sm">
              Your platform ({platform.os}/{platform.arch}) is not one of the five release
              targets. Browse the downloads below, or build from source.
            </p>
          </div>
        )}

        {recommended?.asset && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended for Your System</h3>
            <DownloadCard
              asset={recommended.asset}
              isRecommended={recommended.isExactMatch}
              className="max-w-md"
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Downloads</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {release.assets.map((asset) => (
              <DownloadCard
                key={asset.name}
                asset={asset}
                isRecommended={recommended?.asset?.name === asset.name}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-6">
          <h4 className="font-semibold">One self-contained binary</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {BLURBS[product]} Download, extract, and add it to your PATH — or build it from source.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Linux x86_64', 'Linux aarch64', 'macOS (Apple Silicon)', 'macOS (Intel)', 'Windows x86_64'].map((p) => (
              <span key={p} className="rounded-full bg-background px-3 py-1 text-sm">
                {p}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <a
              href={release.releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              {spec.name} {release.version} release notes and files on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
