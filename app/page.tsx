import { Navigation } from '@/components/navigation'
import { BackToTop } from '@/components/back-to-top'
import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Install } from '@/components/sections/install'
import { MCPIntegration } from '@/components/sections/mcp-integration'
import { ContextGraph } from '@/components/sections/context-graph'
import { Rusta } from '@/components/sections/rusta'
import { Security } from '@/components/sections/security'
import { Footer } from '@/components/footer'
import { DownloadSection } from '@/components/download-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <Hero />
      <section className="py-12 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DownloadSection variant="compact" />
        </div>
      </section>
      <Features />
      <HowItWorks />
      <Install />
      <MCPIntegration />
      <ContextGraph />
      <Rusta />
      <Security />
      <Footer />
      <BackToTop />
    </main>
  )
}
