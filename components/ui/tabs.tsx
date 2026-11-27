'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/**
 * Tabs on Radix's, which follow the WAI-ARIA tabs pattern: a `tablist` (give
 * it an `aria-label`), each tab tied to its panel by id, the arrow keys, Home
 * and End moving between the tabs, and only the selected tab in the tab order.
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
))
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400',
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
      // The defaults are expressed as data-state variants too, so a caller's
      // `data-[state=active]:bg-*` replaces this one via tailwind-merge instead
      // of both landing in the class list and racing on specificity.
      'data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800 data-[state=inactive]:hover:text-slate-100',
      'data-[state=active]:bg-slate-700 data-[state=active]:text-slate-50 data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

/**
 * A tab's panel. Every panel stays in the document, an inactive one hidden, so
 * the static HTML holds every tab's content: search engines and the browser's
 * find see all of it. Radix ties the panel to its tab by an id of its own, so
 * an anchor to a panel goes on an element inside it.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>, 'forceMount' | 'id'>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    forceMount
    className={cn(
      'mt-2 data-[state=inactive]:hidden',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
