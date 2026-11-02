// Platform detection utilities for determining user's OS and architecture

import { RELEASE_TARGETS, type ReleaseAsset } from './github';

export type PlatformOS = 'linux' | 'macos' | 'windows' | 'unknown';
export type PlatformArch = 'x64' | 'arm64' | 'unknown';

export interface DetectedPlatform {
  os: PlatformOS;
  arch: PlatformArch;
  isMobile: boolean;
  userAgent: string;
}

/**
 * Detect the user's platform from navigator.userAgent
 */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === 'undefined') {
    return {
      os: 'unknown',
      arch: 'unknown',
      isMobile: false,
      userAgent: '',
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';

  // Detect OS
  let os: PlatformOS = 'unknown';
  if (userAgent.includes('mac') || platform.includes('mac')) {
    os = 'macos';
  } else if (userAgent.includes('win') || platform.includes('win')) {
    os = 'windows';
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    os = 'linux';
  }

  // Detect architecture
  let arch: PlatformArch = 'unknown';
  
  // Check for ARM64 indicators
  if (
    userAgent.includes('arm64') ||
    userAgent.includes('aarch64') ||
    userAgent.includes('arm v8') ||
    (userAgent.includes('mac') && userAgent.includes('arm')) ||
    (os === 'macos' && userAgent.includes('apple silicon'))
  ) {
    arch = 'arm64';
  } else if (
    userAgent.includes('x86_64') ||
    userAgent.includes('x64') ||
    userAgent.includes('amd64') ||
    userAgent.includes('intel') ||
    userAgent.includes('win32') ||
    userAgent.includes('win64')
  ) {
    arch = 'x64';
  }

  // For macOS, default to ARM64 for newer devices if unclear
  // (most new Macs are Apple Silicon, and Rosetta 2 handles x64 binaries)
  if (os === 'macos' && arch === 'unknown') {
    // Check if running on Apple Silicon by checking for Mac OS X 11+ (Big Sur and later)
    const macVersionMatch = userAgent.match(/mac os x (\d+)[_.](\d+)/);
    if (macVersionMatch) {
      const majorVersion = parseInt(macVersionMatch[1], 10);
      // macOS 11 (Big Sur) was the first to support Apple Silicon
      if (majorVersion >= 11) {
        arch = 'arm64';
      }
    }
    // Default to x64 for older macOS versions
    if (arch === 'unknown') {
      arch = 'x64';
    }
  }

  // For other platforms, default to x64 if unclear (most common)
  if (arch === 'unknown') {
    arch = 'x64';
  }

  // Detect mobile devices
  const isMobile =
    userAgent.includes('mobile') ||
    userAgent.includes('android') ||
    userAgent.includes('iphone') ||
    userAgent.includes('ipad');

  return { os, arch, isMobile, userAgent };
}


/**
 * Get the recommended asset with priority:
 * 1. Exact match for detected platform
 * 2. First asset of the same OS
 * 3. First available asset
 */
export function getRecommendedAsset(
  assets: ReleaseAsset[],
  preferredOS?: PlatformOS,
  preferredArch?: PlatformArch
): { asset: ReleaseAsset | null; isExactMatch: boolean } {
  if (assets.length === 0) {
    return { asset: null, isExactMatch: false };
  }

  const os = preferredOS || detectPlatform().os;
  const arch = preferredArch || detectPlatform().arch;

  // Priority 1: Exact match
  const exactMatch = assets.find(
    (asset) => asset.os === os && asset.arch === arch
  );
  if (exactMatch) {
    return { asset: exactMatch, isExactMatch: true };
  }

  // Priority 2: Same OS, any arch
  const osMatch = assets.find((asset) => asset.os === os);
  if (osMatch) {
    return { asset: osMatch, isExactMatch: false };
  }

  // Priority 3: First available
  return { asset: assets[0], isExactMatch: false };
}


/**
 * Get display name for OS
 */
export function getOSDisplayName(os: PlatformOS): string {
  const names: Record<PlatformOS, string> = {
    linux: 'Linux',
    macos: 'macOS',
    windows: 'Windows',
    unknown: 'Unknown',
  };
  return names[os];
}

/**
 * Get display name for architecture
 */
export function getArchDisplayName(arch: PlatformArch, os?: PlatformOS): string {
  // On macOS the two builds are best labelled by their Mac names.
  if (os === 'macos') {
    if (arch === 'arm64') return 'Apple Silicon';
    if (arch === 'x64') return 'Intel';
  }
  const names: Record<PlatformArch, string> = {
    x64: 'Intel/AMD (x64)',
    arm64: 'Apple Silicon / ARM64',
    unknown: 'Unknown',
  };
  return names[arch];
}


/**
 * Get installation instructions for an asset.
 *
 * Both products ship one folder per archive, `<binary>-<version>-<target>/`,
 * holding the single executable, so the same steps work for each — only the
 * names differ.
 */
export function getInstallInstructions(asset: ReleaseAsset): string[] {
  const bin = asset.binary;
  const folder = asset.name.replace(/\.(tar\.gz|zip)$/, '');
  switch (asset.os) {
    case 'macos':
    case 'linux': {
      const verify = asset.os === 'macos' ? 'shasum -a 256 -c' : 'sha256sum -c';
      return [
        `# Download the archive and its checksum`,
        `curl -L --remote-name-all "${asset.url}"{,.sha256}`,
        ``,
        `# Verify it (prints OK), then extract`,
        `${verify} ${asset.name}.sha256`,
        `tar -xzf ${asset.name}`,
        ``,
        `# Move to PATH`,
        `sudo mv ${folder}/${bin} /usr/local/bin/`,
        ...(asset.os === 'macos'
          ? [``, `# The binary is not signed: clear the quarantine flag if Gatekeeper blocks it`, `xattr -d com.apple.quarantine /usr/local/bin/${bin}`]
          : []),
        ``,
        `# Verify installation`,
        `${bin} --version`,
      ];
    }
    case 'windows':
      return [
        `# Download using PowerShell`,
        `Invoke-WebRequest -Uri "${asset.url}" -OutFile "${asset.name}"`,
        `Invoke-WebRequest -Uri "${asset.url}.sha256" -OutFile "${asset.name}.sha256"`,
        ``,
        `# Verify it: the two hashes must match`,
        `(Get-FileHash -Algorithm SHA256 "${asset.name}").Hash.ToLower()`,
        `Get-Content "${asset.name}.sha256"`,
        ``,
        `# Extract: one folder holding ${bin}.exe and the LICENSE`,
        `Expand-Archive -Path "${asset.name}" -DestinationPath "$env:LOCALAPPDATA\\Programs"`,
        ``,
        `# Add it to your user PATH, and to this session`,
        `$dir = "$env:LOCALAPPDATA\\Programs\\${folder}"`,
        `[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$dir", "User")`,
        `$env:Path += ";$dir"`,
        ``,
        `# Verify installation`,
        `${bin} --version`,
      ];
    default:
      return ['See the installation documentation for manual setup.'];
  }
}

/**
 * Check if the platform is supported
 */
export function isPlatformSupported(platform: DetectedPlatform): boolean {
  return platform.os !== 'unknown' && RELEASE_TARGETS.some(
    (t) => t.os === platform.os
  );
}
