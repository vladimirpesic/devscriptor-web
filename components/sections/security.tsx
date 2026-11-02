'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnMoreButton } from '@/components/learn-more-button'
import {
  Shield,
  Lock,
  Server,
  WifiOff
} from 'lucide-react'

const securityFeatures = [
  {
    icon: Lock,
    title: 'Local-First Analysis',
    description: 'Scanning, indexing, and search make no network calls.',
  },
  {
    icon: Server,
    title: 'Single SQLite File',
    description: 'Your knowledge graph lives in one portable local file.',
  },
  {
    icon: WifiOff,
    title: 'Air-gapped Ready',
    description: 'Runs fully offline once the model is cached.',
  },
  {
    icon: Shield,
    title: 'No Telemetry',
    description: 'No analytics, no tracking, no phone-home.',
  },
]

export function Security() {
  return (
    <section id="security" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Security First
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-white">Your Code Never Leaves</span>{' '}
            <span className="text-gradient">Your Machine</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-6"
          >
            100% local processing. No telemetry. Built for proprietary codebases.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LearnMoreButton href="/security/" variant="outline" />
          </motion.div>
        </div>

        {/* Security features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-sm text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-xs">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
