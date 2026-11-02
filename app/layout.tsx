import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Devscriptor — Local code intelligence for AI agents',
  description: 'Devscriptor builds a knowledge graph of your codebase in a single SQLite file, so any AI coding agent can run semantic search, follow relationships, and keep context across sessions. Analysis runs entirely on your machine.',
  keywords: ['AI coding', 'code analysis', 'semantic search', 'MCP', 'SQLite', 'knowledge graph', 'LSP', 'coding agent', 'Rusta', 'Kimi', 'GLM', 'DeepSeek'],
  authors: [{ name: 'Devscriptor' }],
  creator: 'Devscriptor',
  metadataBase: new URL('https://devscriptor.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devscriptor.com',
    title: 'Devscriptor — Local code intelligence for AI agents',
    description: 'One SQLite file. 26 languages & frameworks. 75 MCP tools. Runs locally on your machine.',
    siteName: 'Devscriptor',
  },
  twitter: {
    card: 'summary',
    title: 'Devscriptor — Local code intelligence for AI agents',
    description: 'One SQLite file. 26 languages & frameworks. 75 MCP tools. Runs locally on your machine.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}