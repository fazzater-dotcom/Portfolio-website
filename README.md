# Mehdi Fazzat — Motion Designer

A single-page 2D motion-design portfolio landing page. Dark theme (`#0C0C0C`), Kanit
typography, and scroll-driven motion throughout.

Built with **React 18 + TypeScript + Vite**, **Tailwind CSS**, **Framer Motion**,
and **Lucide React**.

## Sections

1. **Hero** — nav, giant gradient headline, tagline, contact CTA, and a
   mouse-following magnetic portrait.
2. **Marquee** — two rows of preview GIFs that slide in opposite directions,
   driven by page-scroll position.
3. **About** — decorative 3D objects in the corners and a paragraph that reveals
   character-by-character as you scroll.
4. **Services** — white panel with a five-item service list.
5. **Projects** — three sticky cards that stack and scale down as you scroll past.

## Requirements

- **Node.js 18+** (this project was verified on Node 20). Node was **not**
  installed on this machine — install it from <https://nodejs.org> before running.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed URL (default <http://localhost:5173>).

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Type-check (`tsc`) and build to `dist/`      |
| `npm run preview` | Preview the production build locally         |

## Project structure

```
src/
  components/
    AnimatedText.tsx      Scroll-driven character reveal
    ContactButton.tsx     Gradient pill CTA
    FadeIn.tsx            whileInView fade/slide wrapper (motion.create)
    LiveProjectButton.tsx Ghost/outline pill
    Magnet.tsx            Mouse-following magnetic hover
  sections/
    HeroSection.tsx
    MarqueeSection.tsx
    AboutSection.tsx
    ServicesSection.tsx
    ProjectsSection.tsx
  App.tsx
  main.tsx
  index.css              Global reset + .hero-heading gradient text
```

## Notes

- All imagery is loaded from the original remote hosts (figma.site, motionsites.ai,
  images.higgs.ai). An internet connection is required to see it.
- Fluid typography uses `clamp()` throughout; the layout is mobile-first and scales
  from small phones to ultra-wide screens.
