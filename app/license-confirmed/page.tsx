import { Metadata } from 'next'
import { RedirectNotice } from '@/components/redirect-notice'

// The landing page of a checkout that is no longer offered: it leads to the
// thank-you page of the support links.
export const metadata: Metadata = {
  title: 'Thank You - Devscriptor',
  robots: { index: false, follow: true },
  alternates: { canonical: '/thank-you/' },
}

export default function LicenseConfirmedAddress() {
  return <RedirectNotice to="/thank-you/" what="This page" />
}
