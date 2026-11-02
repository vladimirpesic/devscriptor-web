import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Scale,
  Heart,
  HandHeart,
  Building2,
  ShieldCheck,
  FileText,
  Mail,
  AlertCircle,
  Package,
  Globe,
  Share2,
  Code2,
} from 'lucide-react'
import { CONTACT_EMAIL, supportNav } from '@/lib/navigation'
import { COPYRIGHT, LICENSE_NAME, LICENSE_SPDX, RUSTA_NOT_AFFILIATED } from '@/lib/licensing'
import { WEBSITE_REPO_URL, licenseUrl, repoUrl } from '@/lib/github'

export const metadata: Metadata = {
  title: 'License - Devscriptor',
  description: `Devscriptor and Rusta are free software under the ${LICENSE_NAME}: free to use, change and share, for personal and commercial work alike.`,
}

const mayDo = [
  'Run them for any purpose — personal, open-source, commercial, at work, on client code',
  'Read, change and build the source, and keep the changes you make for yourself private',
  'Pass copies on, changed or not, in source or binary form',
  'Charge for the copies you pass on, or for support, if you wish',
]

const conditions = [
  'Keep the whole work, your changes included, under the same license, and add no restrictions of your own',
  'Give every recipient a copy of the license, and keep the copyright and no-warranty notices',
  'Provide the complete source with every binary, or a way to get it',
  'Mark a changed version as changed, with the date of the change',
]

export default function LicensePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-slate-700 bg-slate-800 text-slate-300">
              <Scale className="mr-1 h-3 w-3" />
              {LICENSE_SPDX}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">License</h1>
            <p className="text-lg text-slate-400">
              Devscriptor and Rusta are free software under the {LICENSE_NAME}. This page sums it
              up; the license text is what applies.
            </p>
          </div>
        </div>
      </section>

      {/* The short version */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Card className="border-emerald-500/25 bg-gradient-to-br from-emerald-900/20 to-slate-900/50">
              <CardContent className="space-y-4 p-8">
                <h2 className="text-xl font-bold text-white">The short version</h2>

                <div className="flex items-start gap-3">
                  <Heart className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Free, for everyone and every use.</span>{' '}
                    Personal projects, open-source work and commercial use are all covered. There is
                    nothing to buy, no seat to count, no key and no account.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Use it at work.</span> On company code,
                    for paid client work, on every machine your team has: running the tools asks
                    nothing of you, and the code you write with them stays outside the license.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Share2 className="mt-1 h-5 w-5 flex-shrink-0 text-violet-400" />
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Share alike.</span> Pass them on,
                    changed or not, and they go under the same license, with their source: whoever
                    gets a copy gets the same freedoms you have.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-400" />
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">The source is public.</span>{' '}
                    <a
                      href={repoUrl('devscriptor')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 underline-offset-4 hover:underline"
                    >
                      Devscriptor
                    </a>{' '}
                    and{' '}
                    <a
                      href={repoUrl('rusta')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 underline-offset-4 hover:underline"
                    >
                      Rusta
                    </a>{' '}
                    are on GitHub, with their releases built from that source by GitHub Actions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* What you may do */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <Heart className="h-5 w-5 text-emerald-400" />
                What the license lets you do
              </h2>
              <ul className="space-y-2 text-slate-400">
                {mayDo.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-emerald-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-500">
                It also grants a license to the contributors&apos; patents that the work needs;
                anyone who sues claiming that the work infringes a patent loses the license.
              </p>
            </div>

            {/* Conditions */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <FileText className="h-5 w-5 text-blue-400" />
                When you pass copies on
              </h2>
              <ul className="space-y-2 text-slate-400">
                {conditions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-blue-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-500">
                Running the tools, at work or anywhere, and changing them for your own use ask
                nothing of you; these conditions apply to passing copies on.
              </p>
            </div>

            {/* Your code */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <Code2 className="h-5 w-5 text-emerald-400" />
                Your code
              </h2>
              <p className="text-slate-400">
                The license covers Devscriptor and Rusta, not what you make with them. The code
                Devscriptor indexes, the answers it gives and the code Rusta writes are not covered
                by it: a program&apos;s output is covered only when, given its content, it is a
                covered work itself, as section 2 of the license says. Any MCP client, proprietary
                ones included, can run Devscriptor.
              </p>
            </div>

            {/* Names */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                The names
              </h2>
              <p className="text-slate-400">
                The license covers the code, not the names: it grants no trademark rights to
                &ldquo;Devscriptor&rdquo; or &ldquo;Rusta&rdquo;, or to their logos.{' '}
                {RUSTA_NOT_AFFILIATED}
              </p>
            </div>

            {/* What they download */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <Package className="h-5 w-5 text-violet-400" />
                What the tools download
              </h2>
              <p className="text-slate-400">
                Devscriptor downloads two kinds of third-party software, each under its own license:
                the embedding model{' '}
                <code className="text-slate-300">jinaai/jina-embeddings-v2-base-code</code>{' '}
                (Apache-2.0), and the language servers you ask it to install. Each language-server
                archive on the Devscriptor mirror carries its server&apos;s license files in a{' '}
                <code className="text-slate-300">LICENSES/</code> folder. The models Rusta talks to
                belong to their vendors, under the terms of your account with them.
              </p>
            </div>

            {/* Warranty */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <AlertCircle className="h-5 w-5 text-slate-400" />
                No warranty
              </h2>
              <p className="text-slate-400">
                The software is provided <span className="text-slate-300">&ldquo;as is&rdquo;</span>, without
                warranty of any kind, and no copyright holder is liable for damages arising from its
                use, as sections 15 and 16 of the license set out.
              </p>
            </div>

            {/* Full text */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-white">
                <Scale className="h-5 w-5 text-blue-400" />
                The license text
              </h2>
              <p className="text-slate-400">
                Each repository carries it as <code className="text-slate-300">LICENSE</code>:{' '}
                <a
                  href={licenseUrl('devscriptor')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  Devscriptor
                </a>
                ,{' '}
                <a
                  href={licenseUrl('rusta')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  Rusta
                </a>
                . The Free Software Foundation publishes it at{' '}
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  gnu.org/licenses/gpl-3.0.html
                </a>
                .
              </p>
              <p className="mt-3 text-slate-400">
                {COPYRIGHT}. Devscriptor, Rusta and this website are licensed under version 3 of the
                license only ({LICENSE_SPDX}), not &ldquo;version 3 or any later version&rdquo;.
              </p>
            </div>

            {/* Support (optional) */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-white">
                <HandHeart className="h-5 w-5 text-rose-400" />
                Support development (optional)
              </h2>
              <p className="mb-4 text-slate-400">
                Nothing here is required, and paying changes none of your rights. If the tools save
                you time and you would like to help fund the work, you can chip in.
              </p>
              <div className="flex flex-wrap gap-3">
                {supportNav.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20"
                  >
                    <Heart className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Payments are handled by Polar, the merchant of record.
              </p>
            </div>

            {/* This website */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white">
                <Globe className="h-5 w-5 text-slate-400" />
                This website
              </h2>
              <p className="text-slate-400">
                devscriptor.com is a static site: it sets no cookies and runs no analytics or
                trackers, and its fonts are served from the site itself. The download buttons lead
                to GitHub, and the support links to Polar, each under its own privacy policy. What
                the tools themselves send over the network is on{' '}
                <a href="/security/" className="text-cyan-400 underline-offset-4 hover:underline">
                  Security &amp; Privacy
                </a>
                . Its{' '}
                <a
                  href={WEBSITE_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline-offset-4 hover:underline"
                >
                  source
                </a>{' '}
                is on GitHub too, under the same license.
              </p>
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-white">
                <Mail className="h-5 w-5 text-blue-400" />
                Questions
              </h2>
              <p className="text-slate-400">
                Write to{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
