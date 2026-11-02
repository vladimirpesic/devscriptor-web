import { Metadata } from 'next'
import { RedirectNotice } from '@/components/redirect-notice'

// There is no commercial license: this address leads to the license page, for
// the links that point here.
export const metadata: Metadata = {
  title: 'License - Devscriptor',
  robots: { index: false, follow: true },
  alternates: { canonical: '/terms/' },
}

export default function CommercialLicenseAddress() {
  return <RedirectNotice to="/terms/" what="Licensing" />
}
