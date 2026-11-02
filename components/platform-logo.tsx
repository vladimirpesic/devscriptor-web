import Image from 'next/image'

/**
 * Official platform logos (Apple, Tux, Windows 11), served from /public/platforms.
 *
 * The source images are 256x256 transparent PNGs; the rendered size comes from
 * `className` so these drop straight into the slots the previous lucide icons
 * occupied (`h-4 w-4`, `w-6 h-6`, …) without changing any surrounding layout.
 */
const PLATFORM_LOGOS = {
  linux: { src: '/platforms/linux.png', alt: 'Linux' },
  macos: { src: '/platforms/apple.png', alt: 'macOS' },
  windows: { src: '/platforms/windows.png', alt: 'Windows' },
} as const

export type PlatformKey = keyof typeof PLATFORM_LOGOS

interface PlatformLogoProps {
  platform: PlatformKey
  /** Tailwind sizing/spacing classes — mirrors what the replaced icon used. */
  className?: string
}

export function PlatformLogo({ platform, className = 'h-4 w-4' }: PlatformLogoProps) {
  const { src, alt } = PLATFORM_LOGOS[platform]

  return (
    <Image
      src={src}
      alt={alt}
      width={256}
      height={256}
      className={`${className} shrink-0 object-contain`}
    />
  )
}
