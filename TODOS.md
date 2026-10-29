# TODOS

## Home page

### Photo strip fallback for Safari before 16

**What:** Give the photo strip in `src/components/Photos.tsx` an `overflow-hidden` fallback for browsers without `overflow: clip`.

**Why:** Safari added `overflow: clip` in version 16. On iOS 15 the five photos (about 960px wide) spill past a phone screen and the page scrolls sideways.

**Context:** The strip uses `overflow-x-clip` so a dragged photo can move up and down freely. Suggested fix: `overflow-hidden supports-[overflow:clip]:overflow-x-clip supports-[overflow:clip]:overflow-y-visible`. Found by the /ship adversarial review on 2026-10-29.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Feed

### Timeout on the feed's article fetches

**What:** Add a timeout to the article fetch in `src/app/feed.xml/route.ts`, for example `fetch(url, { signal: AbortSignal.timeout(5000) })`.

**Why:** The feed scrapes each article page over HTTP. If the live site is slow, a feed request hangs until the host kills the function.

**Context:** Only cache misses are affected, because the feed is cached at the CDN with `s-maxage` for a year. A longer-term option is building the feed from the MDX modules instead of scraping pages, which also fixes preview deploys reading production. Found by the /ship adversarial review on 2026-10-29.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Completed
