'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnMoreButton } from '@/components/learn-more-button'
import {
  Terminal,
  Check
} from 'lucide-react'
import { PlatformLogo, type PlatformKey } from '@/components/platform-logo'
import { LICENSE_SUMMARY } from '@/lib/licensing'
import { archiveName, linuxDownloadCommand, repoUrl, RELEASE_TARGETS } from '@/lib/github'

const ARCHIVE = archiveName('devscriptor', RELEASE_TARGETS[0])
const FOLDER = ARCHIVE.replace(/\.tar\.gz$/, '')
const QUICK_INSTALL = `${linuxDownloadCommand('devscriptor')}
sha256sum -c ${ARCHIVE}.sha256   # verify — prints "OK"
tar -xzf ${ARCHIVE}
sudo mv ${FOLDER}/devscriptor /usr/local/bin/`

const installMethods: {
  name: string
  platform: PlatformKey
  platforms: string
}[] = [
  { name: 'Linux x86_64', platform: 'linux', platforms: 'Intel / AMD 64-bit' },
  { name: 'Linux aarch64', platform: 'linux', platforms: 'ARM64' },
  { name: 'macOS', platform: 'macos', platforms: 'Apple Silicon & Intel' },
  { name: 'Windows x86_64', platform: 'windows', platforms: '64-bit' },
]

const prerequisites = [
  'One self-contained binary — no OpenSSL or extra packages to install',
  'Linux: glibc 2.17+ · macOS 11+ (Apple Silicon & Intel) · Windows 10+ (x86_64)',
  '4 GB free RAM to embed (scanning needs none); language runtimes only for the language servers',
]

export function Install() {
  return (
    <section id="install" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Terminal className="w-3 h-3 mr-1" />
              Installation
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-white">Install in</span>{' '}
            <span className="text-gradient">Three Steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-6"
          >
            Download the self-contained binary for your platform, add it to your PATH, and you&apos;re ready.
            {' '}{LICENSE_SUMMARY}{' '}
            <a
              href={repoUrl('devscriptor')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 underline underline-offset-4 hover:text-white"
            >
              Source on GitHub
            </a>
            .
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LearnMoreButton href="/download/" variant="outline" />
          </motion.div>
        </div>

        {/* Installation methods grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {installMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center hover:border-slate-700 transition-colors"
              >
                <PlatformLogo platform={method.platform} className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">{method.name}</div>
                <div className="text-xs text-slate-500 mt-1">{method.platforms}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick install command */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Quick Install (Linux x86_64)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <code className="text-emerald-400 whitespace-pre">{QUICK_INSTALL}</code>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prerequisites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-md mx-auto mt-6"
        >
          <div className="flex flex-col gap-3 pl-1 sm:pl-2">
            {prerequisites.map((prereq, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-slate-400">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{prereq}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
