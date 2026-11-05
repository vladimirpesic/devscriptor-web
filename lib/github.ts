// Release information for Devscriptor and Rusta.
//
// Both are open source (GPL-3.0-only) and released on GitHub: every release
// carries one archive per platform, each with a `.sha256` beside it. Every
// download URL and install command on the site derives from the versions here,
// and scripts/check-downloads.mts checks each of them before a deploy.

export type ProductId = 'devscriptor' | 'rusta'

export interface ProductSpec {
  id: ProductId
  /** Display name. */
  name: string
  /** Published version, without the tag's leading `v`. */
  version: string
  /** Name of the executable inside the archive (`.exe` on Windows). */
  binary: string
  /** GitHub repository, as `owner/name`. */
  repo: string
}

export const PRODUCTS: Record<ProductId, ProductSpec> = {
  devscriptor: {
    id: 'devscriptor',
    name: 'Devscriptor',
    version: '1.0.4',
    binary: 'devscriptor',
    repo: 'vladimirpesic/devscriptor',
  },
  rusta: {
    id: 'rusta',
    name: 'Rusta',
    version: '1.0.0',
    binary: 'rusta',
    repo: 'vladimirpesic/rusta',
  },
}

export const CURRENT_VERSION = PRODUCTS.devscriptor.version
export const RUSTA_VERSION = PRODUCTS.rusta.version

/** The product's repository on GitHub. */
export function repoUrl(product: ProductId): string {
  return `https://github.com/${PRODUCTS[product].repo}`
}

/** This website's own repository. */
export const WEBSITE_REPO_URL = 'https://github.com/vladimirpesic/devscriptor-web'

/** The license text in the product's repository. */
export function licenseUrl(product: ProductId): string {
  return `${repoUrl(product)}/blob/main/LICENSE`
}

/** The GitHub release page of the product's published version. */
export function releasePageUrl(product: ProductId): string {
  const spec = PRODUCTS[product]
  return `${repoUrl(product)}/releases/tag/v${spec.version}`
}

/** A file of the product's published release. */
export function releaseFileUrl(product: ProductId, file: string): string {
  const spec = PRODUCTS[product]
  return `${repoUrl(product)}/releases/download/v${spec.version}/${file}`
}

export interface ReleaseInfo {
  product: ProductId
  version: string
  assets: ReleaseAsset[]
  /** The release page on GitHub. */
  releaseUrl: string
}

export interface ReleaseAsset {
  /** Archive file name: `<binary>-<version>-<target>.<ext>`. */
  name: string
  product: ProductId
  /** Executable name inside the archive. */
  binary: string
  version: string
  target: string
  os: 'linux' | 'macos' | 'windows'
  arch: 'x64' | 'arm64'
  extension: 'tar.gz' | 'zip'
  /** Download URL of the archive; its checksum is at `${url}.sha256`. */
  url: string
}

// The five targets both products are released for. macOS has an Apple Silicon
// (aarch64) and an Intel (x86_64) build.
export const RELEASE_TARGETS = [
  { target: 'x86_64-unknown-linux-gnu', os: 'linux', arch: 'x64', ext: 'tar.gz' },
  { target: 'aarch64-unknown-linux-gnu', os: 'linux', arch: 'arm64', ext: 'tar.gz' },
  { target: 'aarch64-apple-darwin', os: 'macos', arch: 'arm64', ext: 'tar.gz' },
  { target: 'x86_64-apple-darwin', os: 'macos', arch: 'x64', ext: 'tar.gz' },
  { target: 'x86_64-pc-windows-msvc', os: 'windows', arch: 'x64', ext: 'zip' },
] as const

export type ReleaseTarget = (typeof RELEASE_TARGETS)[number]

/** The archive name of a product's published version for a target. */
export function archiveName(product: ProductId, target: ReleaseTarget): string {
  const spec = PRODUCTS[product]
  return `${spec.binary}-${spec.version}-${target.target}.${target.ext}`
}

/** The published release of a product: one archive per target. */
export function getReleaseInfo(product: ProductId = 'devscriptor'): ReleaseInfo {
  const spec = PRODUCTS[product]
  return {
    product,
    version: spec.version,
    assets: RELEASE_TARGETS.map((t) => {
      const name = archiveName(product, t)
      return {
        name,
        product,
        binary: spec.binary,
        version: spec.version,
        target: t.target,
        os: t.os,
        arch: t.arch,
        extension: t.ext,
        url: releaseFileUrl(product, name),
      }
    }),
    releaseUrl: releasePageUrl(product),
  }
}

/**
 * The one-line Linux x86_64 download of a product: the archive and its
 * checksum. `--remote-name-all` saves every URL under its own name; a plain
 * `-O` would save only the first and print the checksum to the terminal.
 */
export function linuxDownloadCommand(product: ProductId): string {
  const url = releaseFileUrl(product, archiveName(product, RELEASE_TARGETS[0]))
  return `curl -L --remote-name-all ${url}{,.sha256}`
}
