'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Tabs = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [activeValue, setActiveValue] = React.useState(value || defaultValue || '')

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value)
    }
  }, [value])

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setActiveValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = 'Tabs'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component')
  }
  return context
}

const TabsList = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
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
  React.ElementRef<'button'>,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const { value: activeValue, onValueChange } = useTabs()
  const isActive = activeValue === value

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      // Callers style the selected tab with `data-[state=active]:*`, which only
      // matches if this attribute is actually on the element.
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-slate-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        // The defaults are expressed as data-state variants too, so a caller's
        // `data-[state=active]:bg-*` replaces this one via tailwind-merge instead
        // of both landing in the class list and racing on specificity.
        'data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800 data-[state=inactive]:hover:text-slate-100',
        'data-[state=active]:bg-slate-700 data-[state=active]:text-slate-50 data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const { value: activeValue } = useTabs()
  const isActive = activeValue === value

  // An inactive panel stays in the document, hidden, so the static HTML holds
  // every tab's content: search engines and the browser's find see all of it.
  return (
    <div
      ref={ref}
      role="tabpanel"
      hidden={!isActive}
      className={cn(
        'mt-2 ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className,
        !isActive && 'hidden'
      )}
      {...props}
    />
  )
})
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
