# Design Brief Generator

Turns a 15-step questionnaire into a long, specific design brief you can hand to a designer or paste into an AI design tool.

## Why

Briefing a website design badly is the reason most of them come back generic. "Make it modern and clean" gives the designer nothing to work with. This walks you through the decisions that actually determine what a site looks like — brand personality, typography, color, layout structure, animation, reference sites and *why* you picked them — and writes it all out in a structured format.

## The wizard

15 steps, state kept in a small local store so you can move back and forth without losing anything:

business → customer → visual direction → moodboard → reference sites → typography → color → homepage structure → design system → images → animation → mascot → services → service areas → blog → review

The interesting ones:

- **Brand personality sliders** — five axes (corporate↔personal, polished↔raw, established↔scrappy, luxury↔accessible, reserved↔opinionated). These render into the brief as labeled bars rather than raw numbers, so the output reads like an instruction instead of a data dump.
- **Moodboard upload** — every image needs a category and a written reason. An unexplained reference is worthless; forcing the "why" is the point.
- **Reference sites** — same idea, what specifically do you like about it.

## AI autofill

Optional. You supply your own OpenAI key (stored in `localStorage`, never sent anywhere but OpenAI) and it fills the choice fields, references, and sliders from a short business description. Every choice field is backed by a fixed enum map, so the model picks from valid IDs rather than inventing values that the prompt generator can't render. Defaults bias toward bold/dark/asymmetric rather than the safe middle — the safe middle is what you get by not using the tool at all.

Model defaults to `gpt-4o-mini` and is configurable in the modal.

## Output

`promptGenerator.js` assembles everything into the final brief. Moodboard images can be bundled out with JSZip so the brief and its references travel together.

## Run it

```bash
npm install
npm run dev
```

Vite dev server, usually `http://localhost:5173`. Build with `npm run build` — output goes to `dist/`. The included `netlify.toml` handles the SPA redirect if you deploy it there.

## Stack

React 18 · Vite 6 · Tailwind · JSZip
