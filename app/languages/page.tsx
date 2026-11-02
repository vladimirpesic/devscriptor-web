import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Cpu,
  Coffee,
  Square,
  Apple,
  Code,
  Database,
  FileCode,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Languages & Frameworks - Devscriptor',
  description:
    'Devscriptor parses 26 languages and frameworks with tree-sitter 0.27: Python, Rust, TypeScript/TSX, Go, Java, C/C++, C#, Swift, Kotlin, and the Vue & Svelte frameworks.',
}

/** Everything here is a language unless marked otherwise — the site counts "26 languages
 *  & frameworks", so the two non-language kinds stay visibly labelled rather than
 *  silently folded in. */
type LanguageKind = 'framework' | 'markup'

interface Language {
  name: string
  kind?: LanguageKind
}

interface LanguageCategory {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  languages: Language[]
  bgColor: string
  borderColor: string
  /** Written out in full — Tailwind's scanner only sees literal class strings, so
   *  a composed `hover:${borderColor}` would never be generated. */
  hoverBorder: string
}

const categories: LanguageCategory[] = [
  {
    icon: Globe,
    name: 'Web & Frontend',
    description: 'The browser stack — plus the component frameworks built on top of it.',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/30',
    languages: [
      { name: 'JavaScript' },
      { name: 'TypeScript / TSX' },
      { name: 'HTML', kind: 'markup' },
      { name: 'Vue', kind: 'framework' },
      { name: 'Svelte', kind: 'framework' },
    ],
  },
  {
    icon: Code,
    name: 'Scripting & Dynamic',
    description: 'Dynamic languages for backends, automation, and glue code.',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/30',
    languages: [{ name: 'Python' }, { name: 'PHP' }, { name: 'Ruby' }, { name: 'Bash' }],
  },
  {
    icon: Cpu,
    name: 'Systems & Native',
    description: 'High-performance languages for systems and GPU programming.',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    hoverBorder: 'hover:border-orange-500/30',
    languages: [{ name: 'Rust' }, { name: 'C' }, { name: 'C++' }, { name: 'Go' }, { name: 'CUDA' }],
  },
  {
    icon: Coffee,
    name: 'JVM Languages',
    description: 'Languages running on the Java Virtual Machine.',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500/30',
    languages: [{ name: 'Java' }, { name: 'Kotlin' }, { name: 'Scala' }],
  },
  {
    icon: Square,
    name: '.NET & Microsoft',
    description: 'Languages from the .NET and Microsoft development stack.',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/30',
    languages: [{ name: 'C#' }, { name: 'F#' }, { name: 'VB.NET' }],
  },
  {
    icon: Apple,
    name: 'Apple & Mobile',
    description: 'Languages for Apple platforms and cross-platform mobile.',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/30',
    languages: [{ name: 'Swift' }, { name: 'Objective-C' }, { name: 'Dart' }],
  },
  {
    icon: Database,
    name: 'Data & Contracts',
    description: 'Query, schema, and smart-contract languages.',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/30',
    languages: [{ name: 'SQL' }, { name: 'GraphQL' }, { name: 'Solidity' }],
  },
]

const totalLanguages = categories.reduce((sum, cat) => sum + cat.languages.length, 0)

export default function LanguagesPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <FileCode className="w-3 h-3 mr-1" />
              Language Support
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">26 Languages &amp; Frameworks</span>
              <br />
              <span className="text-white">Parsed with Tree-sitter</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Devscriptor wires 26 tree-sitter grammars for consistent, high-accuracy parsing across
              systems, web, JVM, .NET, and mobile stacks — extracting functions, classes, structs,
              enums, interfaces, components, and their relationships.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
                <span className="text-slate-400">Languages &amp; Frameworks:</span>
                <span className="ml-2 text-white font-semibold">{totalLanguages}</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
                <span className="text-slate-400">Parser Engine:</span>
                <span className="ml-2 text-white font-semibold">Tree-sitter 0.27</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Card
                key={index}
                className={`bg-slate-900/50 border-slate-800 ${category.hoverBorder} transition-colors`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <category.icon className="w-6 h-6 text-slate-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className="text-xl text-white">{category.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`${category.bgColor} ${category.borderColor} text-slate-300 text-xs`}
                        >
                          {category.languages.length}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.languages.map((language) => (
                      <span
                        key={language.name}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60 px-3 py-1.5 text-sm font-medium text-white"
                      >
                        {language.name}
                        {language.kind && (
                          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-500">
                            {language.kind}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-slate-500">
              Built on Tree-sitter 0.27, an incremental parsing library. The TypeScript
              grammar covers both TypeScript and TSX, so 26 crates wire 27 grammars in total — every
              language gets a dedicated parser for accurate syntax-tree extraction.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Markdown is indexed too, a heading section at a time rather than through a
              grammar, so the reasoning a codebase writes down — design notes, ADRs,
              thresholds — is searchable alongside the code it explains.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
