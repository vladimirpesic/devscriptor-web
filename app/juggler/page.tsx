import { Metadata } from 'next'
import { RedirectNotice } from '@/components/redirect-notice'

// An earlier address of the Rusta page, kept for the links that point at it.
export const metadata: Metadata = {
  title: 'Rusta - Devscriptor',
  robots: { index: false, follow: true },
  alternates: { canonical: '/rusta/' },
}

export default function OldRustaAddress() {
  return <RedirectNotice to="/rusta/" what="This page" />
}
