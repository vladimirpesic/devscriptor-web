'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnMoreButton } from '@/components/learn-more-button'
import { 
  Bot, 
  Code2,
  Layers,
  Settings
} from 'lucide-react'

const toolCategories = [
  {
    category: 'Core Analysis',
    count: 32,
    icon: Code2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    href: '/mcp-tools/',
    items: ['scan_codebase', 'semantic_search', 'get_relationships', 'add_context_note', 'find_dead_code', 'start_watching'],
  },
  {
    category: 'LSP Intelligence',
    count: 38,
    icon: Layers,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    href: '/lsp-integration/',
    items: ['get_hover', 'get_definition', 'get_references', 'get_completions', 'get_call_hierarchy', 'get_diagnostics'],
  },
  {
    category: 'Architecture',
    count: 5,
    icon: Settings,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    href: '/lsp-integration/',
    items: ['lsp_arch_detect', 'lsp_arch_check', 'lsp_arch_batch_check', 'lsp_arch_status', 'lsp_arch_setup'],
  },
]

const supportedAgents = [
  { name: 'Claude Desktop & Code', status: 'mcpServers entry', color: 'text-orange-400' },
  { name: 'Cursor', status: 'mcpServers entry', color: 'text-blue-400' },
  { name: 'Cline', status: 'mcpServers entry', color: 'text-purple-400' },
  { name: 'Rusta', status: 'Detected automatically', color: 'text-amber-400' },
]

export function MCPIntegration() {
  return (
    <section id="mcp" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />

      <div className="container mx-auto px-4 relative">
        <motion.div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Bot className="w-3 h-3 mr-1" />
              MCP Server
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-white">Works With Your</span>{' '}
            <span className="text-gradient">AI Coding Agents</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-6"
          >
            Native MCP server with 75 total tools: 32 Core + 38 LSP + 5 Architecture
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LearnMoreButton href="/mcp-tools/" variant="outline" />
          </motion.div>
        </motion.div>

        {/* Tool counts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {toolCategories.map((cat, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 sm:p-6 text-center min-w-0">
                <div className={`text-3xl sm:text-4xl font-bold ${cat.color} mb-1`}>{cat.count}</div>
                <div className="text-slate-400 text-xs sm:text-sm break-words leading-tight">{cat.category}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tool categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {toolCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <Card className="h-full flex flex-col bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl ${category.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <category.icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <CardTitle className="text-base text-white">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((tool, toolIndex) => (
                      <code
                        key={toolIndex}
                        className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 break-all"
                      >
                        {tool}
                      </code>
                    ))}
                  </div>
                  <div className="mt-4 pt-1">
                    <LearnMoreButton href={category.href} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Supported agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Supported AI Agents</h3>
            <p className="text-sm text-slate-500">
              Any MCP client that starts a stdio server: <code className="text-slate-400">devscriptor mcp</code>.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportedAgents.map((agent, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
                <div className={`text-sm font-medium ${agent.color}`}>{agent.name}</div>
                <div className="text-xs text-slate-500 mt-1">{agent.status}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
