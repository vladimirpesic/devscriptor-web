import Image from 'next/image'

/**
 * Rusta's logo, served from /public/rusta-logo.png.
 *
 * The image is the Rusta repository's assets/logo.png, cropped to the badge and
 * scaled to 384x384, sharp at twice the largest size the site shows it. The
 * rendered size comes from `className`. Next to the name, pass `alt=""`: the
 * logo then only decorates it.
 */
export function RustaLogo({ className = 'h-8 w-8', alt = 'Rusta', priority = false }: {
  /** Tailwind sizing/spacing classes. */
  className?: string
  alt?: string
  /** Load it at once, for a logo at the top of a page. */
  priority?: boolean
}) {
  return (
    <Image
      src="/rusta-logo.png"
      alt={alt}
      width={384}
      height={384}
      priority={priority}
      className={`${className} shrink-0 object-contain`}
    />
  )
}
