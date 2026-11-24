# devscriptor.com

The website of [Devscriptor](https://github.com/vladimirpesic/devscriptor) and
[Rusta](https://github.com/vladimirpesic/rusta): a Next.js site exported as static
HTML and published to GitHub Pages.

## Develop

Node.js 22.6 or newer (the CI uses 24):

```bash
npm ci
npm run dev                # http://localhost:3000
npm run lint
npm run build              # the static site, in dist/, each page with its CSP
npm run check:downloads    # every download, checksum and source link is live
npx playwright install chromium   # once, for check:pages
npm run check:pages        # accessibility, CSP and sitemap of every built page
```

The site sets no cookies and loads nothing from third parties at run time: its
fonts are downloaded at build time and served with the site. GitHub Pages sets no
headers of a site's choosing, so `npm run build` writes each page's Content
Security Policy into it as a `<meta>` tag (`scripts/csp.mts`): the site's own
origin only, and of inline scripts exactly those the page holds, by their
SHA-256.

`npm run check:pages` serves `dist/` and opens every page in Chromium, at a
phone's width and a desktop's: each must pass axe's WCAG 2.2 A and AA rules, as
loaded, with each of its tabs selected and with the navigation menu open; run
within its policy without a console error; and be in `app/sitemap.ts` if it may
be indexed, and only then.

## Where the facts live

- `lib/github.ts`: each product's published version and repository. Every
  download link, checksum link and install command derives from it.
- `lib/licensing.ts`: the license, as every page states it.
- `lib/navigation.ts`: the header and footer links.
- `lib/support.ts`: the optional support links.
- `lib/benchmarks.ts`: every figure on the benchmarks page, and the archive of
  predictions, reports and trajectories behind them.

## Publishing

`.github/workflows/pages.yml` runs on every push to `main`: it installs, lints,
checks every link `check:downloads` checks, builds, runs `check:pages`, and
deploys `dist/` to GitHub Pages. The custom domain is set in the repository's Pages settings.

After a product's release is published on GitHub, set its version in
`lib/github.ts`. `check:downloads` fails while any archive or `.sha256` of that
version is missing, and warns when a sibling checkout's `Cargo.toml` holds
another version.

The benchmarks page's archive and its `.sha256` are files of this repository's
`swe-bench-multilingual` release, named in `lib/benchmarks.ts`;
`check:downloads` fails while either is missing.

Old addresses keep working: `/juggler/` leads to `/rusta/`, `/commercial-license/`
to `/terms/`, and `/license-confirmed/` to `/thank-you/`.

## License

Copyright (C) 2026 Vladimir Pesic

This website is free software: you can redistribute it and/or modify it under the
terms of the GNU General Public License, version 3, as published by the Free
Software Foundation (GPL-3.0-only), as Devscriptor and Rusta are. It is
distributed WITHOUT ANY WARRANTY; see [LICENSE](LICENSE) for the full text. The
license grants no trademark rights to the names Devscriptor and Rusta, or to
their logos.
