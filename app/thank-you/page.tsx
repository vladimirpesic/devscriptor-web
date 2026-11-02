import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import {
  HandHeart,
  Mail,
  RefreshCw,
  ShieldCheck,
  Download,
  Bot,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { LICENSE_NAME } from '@/lib/licensing'

export const metadata: Metadata = {
  title: 'Thank You - Devscriptor',
  description:
    'Thank you for supporting Devscriptor and Rusta. Your contribution directly funds ongoing development.',
  // Landing target for Polar checkout, not a navigable page — keep it out of search.
  robots: { index: false, follow: true },
}

// What genuinely happens after a Polar checkout. Nothing here is fabricated:
// Polar (the merchant of record) sends the receipt and hosts the portal.
const afterCheckout = [
  {
    icon: Mail,
    title: 'A receipt is on its way',
    body: 'Polar — the merchant of record that handles the payment — emails your receipt. Nothing from us lands in your inbox; there is no mailing list to leave.',
  },
  {
    icon: RefreshCw,
    title: 'Monthly? Cancel anytime',
    body: 'If you chose the monthly option, the same email links to your Polar customer portal, where you can change the amount or stop it whenever you like. No need to ask us.',
  },
  {
    icon: ShieldCheck,
    title: 'Nothing changed in the tools',
    body: 'A contribution unlocks nothing, because there is nothing locked: Devscriptor and Rusta are open source, and stay exactly as they were. Your support just keeps the work going.',
  },
]

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
            <HandHeart className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Thank you{' '}
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              — really
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Devscriptor and Rusta are built by one person and given away as open source. A
            contribution from someone who finds them useful is the most direct signal that the work
            is worth continuing — and it funds exactly that. It genuinely matters.
          </p>
        </div>
      </section>

      {/* What happens next */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {afterCheckout.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10">
                  <item.icon className="h-5 w-5 text-rose-400" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where your support goes */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <Heart className="h-5 w-5 flex-shrink-0 text-rose-400" />
                <h2 className="text-xl font-bold text-white">Where it goes</h2>
              </div>
              <p className="text-slate-400">
                Straight into the work — new language support, faster scans, the language-server
                integration, and keeping Rusta current as Kimi, GLM and DeepSeek ship new models. Both
                tools stay <span className="text-white">free and open source</span>, under the{' '}
                {LICENSE_NAME}, whoever uses them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onward */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-sm uppercase tracking-wider text-slate-500">
              While you&apos;re here
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/download/"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Get the tools
              </a>
              <a
                href="/rusta/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
              >
                <Bot className="h-4 w-4" />
                Explore Rusta
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
              >
                Home
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-8 text-sm text-slate-500">
              Something not right with your contribution? Email{' '}
              <a
                href="mailto:contact@devscriptor.com"
                className="text-slate-400 underline underline-offset-4 hover:text-white"
              >
                contact@devscriptor.com
              </a>{' '}
              and I&apos;ll sort it out.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
