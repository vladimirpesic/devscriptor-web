'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnMoreButton } from '@/components/learn-more-button'
import { Brain, FileText, Link2, RefreshCw } from 'lucide-react'

const noteTypes = [
  { type: 'adr', title: 'Architecture Decisions', color: 'from-blue-500 to-cyan-500' },
  { type: 'standard', title: 'Coding Standards', color: 'from-green-500 to-emerald-500' },
  { type: 'optimization', title: 'Performance', color: 'from-yellow-500 to-orange-500' },
  { type: 'failure', title: 'Failures & Mistakes', color: 'from-red-500 to-pink-500' },
  { type: 'practice', title: 'Best Practices', color: 'from-violet-500 to-purple-500' },
  { type: 'reflection', title: 'Reflections', color: 'from-amber-500 to-yellow-500' },
  { type: 'general', title: 'General Knowledge', color: 'from-indigo-500 to-blue-500' },
  { type: 'file_description', title: 'File Descriptions', color: 'from-teal-500 to-cyan-500' },
  { type: 'modification', title: 'Modification Records', color: 'from-pink-500 to-rose-500' },
]

const features = [
  {
    icon: FileText,
    title: 'Same SQLite Database',
    description: 'Notes live alongside the code graph in one local file, persisting across sessions and processes.',
  },
  {
    icon: Link2,
    title: 'Linked to Code & Concepts',
    description: 'Attach notes to concrete entities and abstract concepts, then recall them by association later.',
  },
  {
    icon: RefreshCw,
    title: 'Keyword, Semantic & Hybrid Search',
    description: 'Retrieve notes by keyword, vector similarity, or RRF-fused hybrid search with type & priority filters.',
  },
]

export function ContextGraph() {
  return (
    <section id="context-graph" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" />
              Context Graph
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-white">AI Agents That</span>{' '}
            <span className="text-gradient">Remember</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-6"
          >
            Long-term memory system that persists knowledge across AI sessions with 9 structured note types
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LearnMoreButton href="/context-graph/" variant="outline" />
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-purple-400 mb-3" />
                  <CardTitle className="text-white text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Note Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-2">9 Structured Note Types</h3>
          <p className="text-slate-400 text-sm">Comprehensive knowledge capture for any scenario</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {noteTypes.map((note, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center hover:border-slate-700 transition-colors">
                <Badge className={`bg-gradient-to-r ${note.color} text-white border-0 text-xs mb-2`}>
                  {note.type}
                </Badge>
                <div className="text-xs text-slate-400">{note.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
