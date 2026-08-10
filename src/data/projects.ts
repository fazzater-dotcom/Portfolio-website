export type Project = {
  id: string
  n: number
  title: string
  /** Accent colour for the placeholder gradient (used when there's no image/video). */
  accent: string
  /** Public URL of the card image (auto-filled from the workicons folder). */
  image?: string
  /** Public URL of the full project video (auto-filled, WV_<n>.*). */
  video?: string
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD A NEW WORK  (no code changes needed)
 *  1. Drop a thumbnail into  MEDIA/VIDEOS/work/workicons/  named  WI_<number>.<ext>
 *     e.g.  WI_9.png / WI_9.jpg / WI_9.webp
 *     → appears in the carousel automatically, ordered by that number.
 *  2. Fill the work's popup page with as many media items as you want, in
 *     whatever order, mixing video, images, YouTube links and little text
 *     blurbs freely — one folder per work, named WE_<number>:
 *       MEDIA/VIDEOS/work/WorkElements/WE_<number>/1.<ext>
 *       MEDIA/VIDEOS/work/WorkElements/WE_<number>/2.<ext>
 *       MEDIA/VIDEOS/work/WorkElements/WE_<number>/3.<ext>   …and so on
 *     e.g. for work 9:  WorkElements/WE_9/1.mp4, WE_9/2.jpg, WE_9/3.jpg
 *     → they appear on that work's popup top-to-bottom in that numeric
 *     order. You can put anything after the number in the filename
 *     (e.g. "1-hero.mp4"), only the leading number controls the order.
 *
 *     What each file type does:
 *       .mp4 / .webm / .mov   → plays as a local video
 *       .jpg / .png / .webp   → shows as an image
 *       .txt                  → depends what's written inside it:
 *                                • starts with "TITLE: "  → a bold section
 *                                  heading, right there in the stack —
 *                                  e.g. WE_9/3.txt containing
 *                                  "TITLE: Storyboard" puts that heading
 *                                  above whatever comes next (item 4, etc).
 *                                  Use as many as you like, wherever you
 *                                  like — a heading before the main video,
 *                                  another one before a later photo set…
 *                                • just a YouTube link (unlisted is fine)
 *                                  → embeds as a video player
 *                                • anything else            → shows as a
 *                                  small description AT THAT POINT in the
 *                                  stack — e.g. WE_9/4.txt with a sentence
 *                                  in it puts that text right below item 3.
 *
 *     So one video, ten photos, a title + video + 2 photos + a caption —
 *     whatever mix you want. The popup's height simply grows to fit.
 *  ─────────────────────────────────────────────────────────────────────────
 */

export type MediaBlock =
  | { type: 'video'; url: string }
  | { type: 'image'; url: string }
  | { type: 'youtube'; videoId: string }
  | { type: 'title'; text: string }
  | { type: 'text'; text: string }

const VIDEO_EXT = /\.(mp4|webm|mov)$/i
const YOUTUBE_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i
const TITLE_PATTERN = /^\s*TITLE\s*:\s*(.+)$/i

// A .txt block is: a custom title if it starts with "TITLE:"; a YouTube link
// if that's ~all it contains; otherwise a description paragraph shown at
// that point in the stack.
function parseWorkpageText(raw: string): MediaBlock {
  const trimmed = raw.trim()
  const titleMatch = TITLE_PATTERN.exec(trimmed)
  if (titleMatch) return { type: 'title', text: titleMatch[1].trim() }
  const ytMatch = YOUTUBE_PATTERN.exec(trimmed)
  return ytMatch ? { type: 'youtube', videoId: ytMatch[1] } : { type: 'text', text: trimmed }
}

// Auto-discover ordered popup content: MEDIA/VIDEOS/work/WorkElements/WE_<n>/<order>-*.<ext>
// Each work's own WE_<n> subfolder can hold any mix of local video/image
// files AND .txt files (a pasted YouTube link → embedded video, or plain
// text → a description at that spot). They render top-to-bottom, sorted by
// the leading number in the filename.
const workpageMediaFiles = import.meta.glob(
  '/MEDIA/VIDEOS/work/WorkElements/WE_*/*.{mp4,webm,mov,png,jpg,jpeg,webp,avif,gif}',
)
const workpageTextFiles = import.meta.glob('/MEDIA/VIDEOS/work/WorkElements/WE_*/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function buildWorkBlocks(): Map<number, MediaBlock[]> {
  const byWork = new Map<number, { order: number; block: MediaBlock }[]>()
  const add = (workN: number, order: number, block: MediaBlock) => {
    const list = byWork.get(workN) ?? []
    list.push({ order, block })
    byWork.set(workN, list)
  }

  for (const path of Object.keys(workpageMediaFiles)) {
    const match = /WE_(\d+)\/(\d+)[^/]*\.\w+$/i.exec(path)
    if (!match) continue
    const type: 'video' | 'image' = VIDEO_EXT.test(path) ? 'video' : 'image'
    add(parseInt(match[1], 10), parseInt(match[2], 10), {
      type,
      url: path.replace(/^\/MEDIA/, ''),
    })
  }

  for (const [path, content] of Object.entries(workpageTextFiles)) {
    const match = /WE_(\d+)\/(\d+)[^/]*\.txt$/i.exec(path)
    if (!match) continue
    add(parseInt(match[1], 10), parseInt(match[2], 10), parseWorkpageText(content))
  }

  const result = new Map<number, MediaBlock[]>()
  for (const [n, items] of byWork) {
    result.set(
      n,
      items.sort((a, b) => a.order - b.order).map((i) => i.block),
    )
  }
  return result
}

const WORK_BLOCKS = buildWorkBlocks()

export function getWorkBlocks(n: number): MediaBlock[] {
  return WORK_BLOCKS.get(n) ?? []
}

// Accent colours cycled through for cards that don't have their own image yet.
const ACCENTS = ['#e56b59', '#5b8def', '#57c07a', '#c77dff', '#f4a259', '#2ec4b6', '#ef476f', '#8ac926']

// Auto-discover work thumbnails: MEDIA/VIDEOS/work/workicons/WI_<n>.<ext>
// Auto-discover full work videos: MEDIA/VIDEOS/work/WV_<n>.<ext>
// We only use the file paths (keys) for discovery; the files live in the
// public MEDIA folder, so their URL is the path with the "/MEDIA" prefix removed.
const iconFiles = import.meta.glob(
  '/MEDIA/VIDEOS/work/workicons/WI_*.{png,jpg,jpeg,webp,avif,gif}',
)
const videoFiles = import.meta.glob('/MEDIA/VIDEOS/work/WV_*.{mp4,webm,mov}')

function numberedUrls(files: Record<string, unknown>, pattern: RegExp) {
  const map = new Map<number, string>()
  for (const path of Object.keys(files)) {
    const match = pattern.exec(path)
    if (match) map.set(parseInt(match[1], 10), path.replace(/^\/MEDIA/, ''))
  }
  return map
}

function buildFromIcons(): Project[] {
  const icons = numberedUrls(iconFiles, /WI_(\d+)\./i)
  const videos = numberedUrls(videoFiles, /WV_(\d+)\./i)

  return [...icons.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([n, url]) => ({
      id: `work-${n}`,
      n,
      title: `Work ${String(n).padStart(2, '0')}`,
      accent: ACCENTS[(n - 1) % ACCENTS.length],
      image: url,
      video: videos.get(n),
    }))
}

// Placeholder set shown only until the first WI_* image is added.
const PLACEHOLDERS: Project[] = [
  'Kinetic Type Reel',
  'Brand Loop',
  'Explainer Series',
  'Social Motion Pack',
  'Logo Animation Set',
  'Title Sequence',
  'Product Promo',
  'Infographic Motion',
].map((title, i) => ({
  id: `work-${i + 1}`,
  n: i + 1,
  title,
  accent: ACCENTS[i % ACCENTS.length],
}))

const fromIcons = buildFromIcons()

export const PROJECTS: Project[] = fromIcons.length > 0 ? fromIcons : PLACEHOLDERS

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id)
}
