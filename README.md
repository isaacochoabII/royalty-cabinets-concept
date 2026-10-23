# Royalty Cabinets website

The new royaltycabinets.ca: a static Astro site, positioned around Royalty as the cabinet installer *you don't have to manage*, and written in Raphael's own words. The look follows the Royalty Cabinets design system v1.1 (LIF Media): cream and charcoal, a touch of gold, Outfit and DM Sans, square corners and hairlines.

[Open the preview](https://isaacochoabII.github.io/royalty-cabinets-concept/) (it's set to noindex and never competes with the live domain).

## Pages

| URL | Purpose |
|---|---|
| `/` | Positioning, proof, the three client types |
| `/builders/` | Multi-unit builders, developers and manufacturers: how a building runs, case study, FAQ |
| `/installation/` | Homeowners and investors: buy anywhere, we install; flat-pack; how much kitchen a flip or rental needs |
| `/ikea-kitchen-installation-moncton/` | IKEA kitchen assembly and installation in Greater Moncton |
| `/estimates/` | Three short quote forms (builders, homeowners, manufacturers) |

`/installation/` and `/estimates/` keep the paths from the old WordPress site, so existing links and rankings carry over.

## Run and build

Requires Node 22.23+ and pnpm 11 (`npx pnpm@11.25.0` works if pnpm isn't installed).

```sh
pnpm install
pnpm dev        # http://127.0.0.1:4321
pnpm build      # static output in dist/
```

## Where things live

- `src/styles/global.css`: design system tokens (light and dark themes) and shared styles. Fonts are self-hosted from `src/assets/fonts/`.
- `src/data/site.ts`: business details, approved facts, and the review excerpts used across pages. Reviews still need each reviewer's permission (design system rule).
- `public/photos/`: web versions of the shoot (800 and 1600 px, resized only, no grade). Pass the base name to `Photo`, e.g. `src="photos/finished-kitchen"`. Full-resolution originals stay in `/assets/`, which git ignores.
- `public/brand/`: logo files from the design system (full colour for light backgrounds, cream wordmark for dark).
- `src/pages/`: one file per page. Copy lives in the page files.
- `src/components/Photo.astro`: shows a labelled "Photo to come" block with the shot description until a real `src` is passed. Remaining placeholders (sign-off sheet, floor report, two IKEA shots) are the outstanding shot list.
- `src/data/faq.ts`: FAQ items render on the page and as FAQPage structured data from the same source.

## Before launch

- **Forms:** set `PUBLIC_FORM_ENDPOINT` to a form service URL (Formspree, Basin, etc.). File uploads need a plan that accepts attachments. Until then, the forms ask visitors to call or text.
- **Photos:** shoot the remaining placeholders. Don't use the van photo, since it shows the old (506) 855-3043 number.
- **Facts:** confirm the open items in `src/data/site.ts` with Raphael.
- **Domain:** move royaltycabinets.ca DNS and email to Raphael's accounts, and 301-redirect old URLs that aren't rebuilt yet (`/about-us/`, `/supply/`, `/gallery/`, `/careers/`).
- **Search setup:** Search Console and GA4.

## Publishing

Every push to `main` builds and deploys the preview to GitHub Pages, with `PUBLIC_NOINDEX=true` so it stays out of search. A production deploy at the root domain needs no base path and no noindex.

Strategy and research notes are kept in the gitignored `strategy/` folder because they quote private interviews. Don't commit them.
