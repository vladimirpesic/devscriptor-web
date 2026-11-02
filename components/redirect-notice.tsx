'use client'

import { useEffect } from 'react'

/**
 * The page of a route that has moved. The site is a static export with no
 * server to answer with a 301, so the move is made in the browser: a meta
 * refresh, which works without JavaScript, and a `location.replace` that keeps
 * the URL's `#fragment` and leaves the old URL out of the history. The link is
 * for anyone whose browser does neither.
 */
export function RedirectNotice({ to, what }: { to: string; what: string }) {
  useEffect(() => {
    window.location.replace(to + window.location.hash)
  }, [to])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p className="text-center text-slate-400">
        {what} has moved to{' '}
        <a href={to} className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
          {to}
        </a>
        .
      </p>
    </main>
  )
}
