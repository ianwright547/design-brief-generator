function personalityLabel(value) {
  if (value <= 15) return 'Fully left'
  if (value <= 30) return '~75% left'
  if (value <= 45) return 'Slightly left'
  if (value <= 55) return 'Center'
  if (value <= 70) return 'Slightly right'
  if (value <= 85) return '~75% right'
  return 'Fully right'
}

function formatPersonality(p) {
  const labels = {
    corporatePersonal: ['Corporate', 'Personal'],
    polishedAuthentic: ['Polished', 'Raw/Authentic'],
    establishedScrappy: ['Established', 'Scrappy/New'],
    luxuryAccessible: ['Luxury', 'Accessible'],
    reservedOpinionated: ['Reserved', 'Opinionated'],
  }
  let lines = []
  for (const [key, [left, right]] of Object.entries(labels)) {
    const val = p[key] ?? 50
    const pct = val
    let marker = ''
    if (pct <= 20) marker = `[##----] Heavy ${left}`
    else if (pct <= 40) marker = `[#--#--] Leaning ${left}`
    else if (pct <= 60) marker = `[--##--] Balanced`
    else if (pct <= 80) marker = `[--#--#] Leaning ${right}`
    else marker = `[----##] Heavy ${right}`
    lines.push(`  ${left} ${marker} ${right}`)
  }
  return lines.join('\n')
}

function formatMoodboard(images) {
  if (!images || images.length === 0) return '[No moodboard images uploaded — attach separately]'
  return images.map((img, i) => {
    const cat = img.category || 'uncategorized'
    const reason = img.reason || 'no reason provided'
    return `  ${i + 1}. [${cat.toUpperCase()}] ${img.name}\n     Why: ${reason}`
  }).join('\n')
}

function formatReferences(refs) {
  return refs
    .filter(r => r.url)
    .map((r, i) => {
      return [
        `  REFERENCE ${i + 1}: ${r.url}`,
        r.businessType ? `    Business type: ${r.businessType}` : null,
        `    Taking: ${r.taking || 'not specified'}`,
        `    Ignoring: ${r.ignoring || 'not specified'}`,
      ].filter(Boolean).join('\n')
    }).join('\n\n') || '  [No references provided]'
}

function formatWorkPhotos(images) {
  if (!images || images.length === 0) return '[No work photos uploaded — attach separately]'
  const favorites = images.filter(i => i.isFavorite)
  const regular = images.filter(i => !i.isFavorite)
  let out = `  Total photos: ${images.length}`
  if (favorites.length > 0) {
    out += `\n  HERO/FEATURE CANDIDATES (marked as favorites):\n`
    out += favorites.map((img, i) =>
      `    ${i + 1}. ${img.name}${img.description ? ' — ' + img.description : ''}`
    ).join('\n')
  }
  if (regular.length > 0) {
    out += `\n  Additional photos:\n`
    out += regular.map((img, i) =>
      `    ${i + 1}. ${img.name}${img.description ? ' — ' + img.description : ''}`
    ).join('\n')
  }
  return out
}

function formatHtmlReferences(htmlRefs) {
  if (!htmlRefs?.files || htmlRefs.files.length === 0) return ''
  let out = `\n------------------------------------------------------------
HTML SITE REFERENCES (attached code)
------------------------------------------------------------
${htmlRefs.files.length} HTML file(s) uploaded for structural reference:\n`
  htmlRefs.files.forEach((f, i) => {
    out += `\n--- FILE ${i + 1}: ${f.name} (${f.sizeKb} KB) ---\n`
    if (f.notes) out += `Notes: ${f.notes}\n`
    out += `\n${f.content}\n`
  })
  return out
}

function formatMascot(mascot) {
  if (!mascot || !mascot.wantsMascot || mascot.wantsMascot === 'no') return ''

  const labels = {
    style: {
      'flat-vector': 'Flat Vector (clean 2D, bold shapes, no shading)',
      'shaded-2d': 'Shaded 2D (flat with subtle gradients for depth)',
      'geometric': 'Geometric/Abstract (built from basic shapes)',
      'mascot-logo': 'Mascot Logo/Badge (bold silhouette, no facial detail)',
      'line-art': 'Line Art (clean outline, minimal fill)',
      'silhouette': 'Silhouette/Shadow (solid filled shape, no internal detail)',
    },
    character: {
      'owner-figure': 'Faceless 2D owner/founder figure (personality through build, outfit, pose)',
      'team-figures': 'Multiple faceless team member figures (differentiated by uniforms, tools)',
      'worker-figure': 'Generic faceless tradesperson figure (hard hat, tool belt, uniform)',
      'animal-mascot': 'Animal mascot (stylized, no detailed face)',
      'object-mascot': 'Object/tool mascot (no face, personality through shape/pose)',
      'symbol-character': 'Symbol/icon character (shield, flame, gear with personality)',
    },
    pose: {
      'standing-strong': 'Standing/strong (upright, confident posture)',
      'in-action': 'In action (holding tools, building, working)',
      'dynamic-motion': 'Dynamic/motion (leaping, running, mid-action)',
      'presenting': 'Presenting/directing (gesturing toward content)',
      'resting-calm': 'Resting/calm (relaxed, leaning, trustworthy)',
      'multiple-poses': 'Multiple poses needed',
    },
    useCase: {
      'hero-feature': 'Hero/feature image (large, prominent)',
      'section-accent': 'Section accents (smaller, throughout page)',
      'about-page': 'About page identity',
      'faq-guide': 'FAQ/guide companion',
      'logo-integration': 'Part of the logo',
      'all-around': 'Versatile, used across multiple sections',
    },
  }

  let out = `\n------------------------------------------------------------
MASCOT / CHARACTER
------------------------------------------------------------
CONSTRAINT: Halal-compliant — 2D flat illustration ONLY.
NO facial features (no eyes, mouth, nose). Personality conveyed
through shape, pose, body language, accessories, and color.

Status: ${mascot.wantsMascot === 'yes' ? 'YES — custom character needed' : 'EXPLORING — open to options'}
Style: ${labels.style[mascot.style] || mascot.style || '[not specified]'}
Character type: ${labels.character[mascot.character] || mascot.character || '[not specified]'}`

  if (mascot.character === 'animal-mascot' && mascot.animalType) {
    out += `\nAnimal: ${mascot.animalType}`
  }

  out += `
Pose: ${labels.pose[mascot.pose] || mascot.pose || '[not specified]'}
Energy/vibe: ${mascot.expression || '[not specified]'}
Colors: ${mascot.colors || '[not specified]'}
Use case: ${labels.useCase[mascot.useCase] || mascot.useCase || '[not specified]'}`

  if (mascot.notes) {
    out += `\nAdditional notes: ${mascot.notes}`
  }

  if (mascot.referenceImages?.length > 0) {
    out += `\nReference images: ${mascot.referenceImages.length} uploaded`
    mascot.referenceImages.forEach((img, i) => {
      const cat = img.category || 'uncategorized'
      const reason = img.reason || ''
      out += `\n  ${i + 1}. [${cat}] ${img.name}${reason ? ' — ' + reason : ''}`
    })
    out += `\n[Attach mascot reference images separately]`
  }

  return out
}

export function generateFullPrompt(brief, clientName) {
  const b = brief.business
  const c = brief.customer
  const v = brief.visual
  const t = brief.typography
  const col = brief.color
  const h = brief.homepage
  const ds = brief.designSystem
  const img = brief.images
  const anim = brief.animation
  const mb = brief.moodboard

  return `============================================================
HOMEPAGE DESIGN BRIEF — ${b.name || clientName || '[BUSINESS NAME]'}
============================================================
This is a complete design brief for a LOCAL BUSINESS homepage.
The design must feel custom, creative, and high-end — NOT
template-based or AI-generated. No basic cards. No generic
animations. Every section should feel intentionally designed.

Review scrolling feed style: Google quotes, all 5 stars,
no photos/video, horizontal infinite scroll, typography-driven,
no cards.

No sticky click-to-call. No online booking widget.
Contact form: whatever converts best (short form preferred).
Embed Google Maps link for service area.

------------------------------------------------------------
1. THE BUSINESS
------------------------------------------------------------
Business name: ${b.name || '[not provided]'}
What they do: ${b.whatYouDo || '[not provided]'}
City/area served: ${b.city || '[not provided]'}
Years in business: ${b.yearsInBusiness || '[not provided]'}
The ONE differentiator: ${b.differentiator || '[not provided]'}
Google reviews: ${b.googleReviewCount || '?'} reviews at ${b.googleRating || '?'} stars

------------------------------------------------------------
2. THE CUSTOMER
------------------------------------------------------------
Who is searching: ${c.whoIsSearching || '[not provided]'}
Primary concern: ${c.primaryConcern || '[not provided]'}
Device split: ${c.deviceSplit || '[not provided]'}

------------------------------------------------------------
3. VISUAL DIRECTION
------------------------------------------------------------
Style direction: ${v.styleDirection || '[not provided]'}

Personality spectrum:
${formatPersonality(v.personality)}

Design adjectives:
  1. ${v.adjectives[0] || '[visual]'}
  2. ${v.adjectives[1] || '[visual]'}
  3. ${v.adjectives[2] || '[emotional]'}
  4. ${v.adjectives[3] || '[any]'}
  5. ANTI: NOT ${v.adjectives[4] || '[what to avoid]'}

------------------------------------------------------------
4. MOODBOARD
------------------------------------------------------------
${formatMoodboard(mb.images)}

[NOTE: Actual moodboard images should be attached/shared
separately. The descriptions above are for reference.]

------------------------------------------------------------
5. WEBSITE REFERENCES
------------------------------------------------------------
${formatReferences(brief.references)}

------------------------------------------------------------
6. TYPOGRAPHY
------------------------------------------------------------
Type energy: ${t.energy || '[not provided]'}
Headlines: ${t.headlines || '[not provided]'}
Font liked/referenced: ${t.fontLiked || '[not provided]'}
Selected heading font: ${t.headingFont || '[not specified]'}
Selected body font: ${t.bodyFont || '[not specified]'}
${t.customFonts?.length > 0 ? `Custom fonts uploaded: ${t.customFonts.map(f => f.name).join(', ')}` : ''}

------------------------------------------------------------
7. COLOR SYSTEM
------------------------------------------------------------
Physical space feel: ${col.physicalSpaceFeel || '[not provided]'}
Brand colors: ${col.brandColors || '[none yet]'}
Competitors' colors: ${col.competitorColors || '[not provided]'}
Light or dark dominant: ${col.lightOrDark || '[not provided]'}
Color to avoid: ${col.colorHate || '[not provided]'}

------------------------------------------------------------
8. HOMEPAGE SECTIONS
------------------------------------------------------------
Hero type: ${h.heroType || '[not provided]'}
${h.heroNotes ? `Hero notes: ${h.heroNotes}` : ''}

Services display: ${h.servicesDisplay || '[not provided]'}
${h.servicesNotes ? `Services notes: ${h.servicesNotes}` : ''}

Work/gallery display: ${h.galleryDisplay || '[not provided]'}
${h.galleryNotes ? `Gallery notes: ${h.galleryNotes}` : ''}

Reviews: Horizontal infinite scroll, typography-driven,
no cards, Google quotes only, 5-star, first name + G icon.
${h.reviewStyle !== 'horizontal-scroll-no-cards' ? `Adjusted to: ${h.reviewStyle}` : ''}

About approach: ${h.aboutApproach || '[not provided]'}
${h.aboutNotes ? `About notes: ${h.aboutNotes}` : ''}

Map: Embedded Google Maps — ${h.mapStyle || 'style not specified'}

Contact form: ${h.contactFields || 'name + phone + message'}
${h.contactNotes ? `Contact notes: ${h.contactNotes}` : ''}

Section priority (top = most visual weight):
${h.sectionPriority?.map((s, i) => `  ${i + 1}. ${s}`).join('\n') || '  [default order]'}

------------------------------------------------------------
9. DESIGN SYSTEM
------------------------------------------------------------
Spacing:      ${ds.spacing || '[not set]'}
Corners:      ${ds.corners || '[not set]'}
Shadows:      ${ds.shadows || '[not set]'}
Photo style:  ${ds.photoStyle || '[not set]'}
Accent usage: ${ds.accentUsage || '[not set]'}

------------------------------------------------------------
10. IMAGES AVAILABLE
------------------------------------------------------------
${formatWorkPhotos(img.photos)}
Quantity: ${img.quantity || '[not specified]'}
Quality: ${img.quality || '[not specified]'}
Standout images: ${img.proudOf || '[not specified]'}

[NOTE: Actual work photos should be attached/shared
separately. The descriptions above are for reference.]

------------------------------------------------------------
11. ANIMATION INTENT
------------------------------------------------------------
Motion feel: ${anim.motionFeel || '[not provided]'}
Loved example: ${anim.lovedExample || '[not provided]'}
Annoyances: ${anim.annoyances || '[not provided]'}
${formatMascot(brief.mascot)}${formatHtmlReferences(brief.htmlReferences)}
============================================================
END OF BRIEF
============================================================`
}

export function generateSplitPrompts(brief, clientName) {
  const b = brief.business
  const c = brief.customer
  const v = brief.visual
  const t = brief.typography
  const col = brief.color
  const h = brief.homepage
  const ds = brief.designSystem
  const img = brief.images
  const anim = brief.animation
  const mb = brief.moodboard
  const name = b.name || clientName || '[BUSINESS NAME]'

  const prompt1 = `============================================================
PROMPT 1 of 3 — CONTEXT & VISUAL DIRECTION
${name} — Local Business Homepage
============================================================
This is Part 1 of a 3-part design brief. DO NOT start
designing yet. Absorb this context. I will send Part 2
(Design System) and Part 3 (Homepage Build) next.

The final output must feel custom, creative, and high-end.
NOT template-based. NOT AI-generated. No basic cards.
No generic animations. Every section intentionally designed.

--- BUSINESS ---
Business name: ${b.name || '[not provided]'}
What they do: ${b.whatYouDo || '[not provided]'}
City/area: ${b.city || '[not provided]'}
Years in business: ${b.yearsInBusiness || '[not provided]'}
Differentiator: ${b.differentiator || '[not provided]'}
Google reviews: ${b.googleReviewCount || '?'} at ${b.googleRating || '?'} stars

--- CUSTOMER ---
Who is searching: ${c.whoIsSearching || '[not provided]'}
Primary concern: ${c.primaryConcern || '[not provided]'}
Device split: ${c.deviceSplit || '[not provided]'}

--- VISUAL DIRECTION ---
Style direction: ${v.styleDirection || '[not provided]'}

Personality:
${formatPersonality(v.personality)}

Adjectives:
  1. ${v.adjectives[0] || ''}
  2. ${v.adjectives[1] || ''}
  3. ${v.adjectives[2] || ''}
  4. ${v.adjectives[3] || ''}
  5. ANTI: NOT ${v.adjectives[4] || ''}

--- MOODBOARD ---
${formatMoodboard(mb.images)}
[Attach actual moodboard images with this prompt]

--- REFERENCES ---
${formatReferences(brief.references)}
${formatHtmlReferences(brief.htmlReferences)}
============================================================
Confirm you've absorbed this. Then I'll send Prompt 2.
============================================================`

  const prompt2 = `============================================================
PROMPT 2 of 3 — DESIGN SYSTEM
${name} — Local Business Homepage
============================================================
This is Part 2. You should already have Part 1 (Context &
Visual Direction). Now build the design system from these inputs.

--- TYPOGRAPHY ---
Type energy: ${t.energy || '[not provided]'}
Headlines: ${t.headlines || '[not provided]'}
Font liked: ${t.fontLiked || '[not provided]'}
Heading font: ${t.headingFont || '[not specified]'}
Body font: ${t.bodyFont || '[not specified]'}
${t.customFonts?.length > 0 ? `Custom fonts: ${t.customFonts.map(f => f.name).join(', ')}` : ''}

--- COLOR SYSTEM ---
Physical space: ${col.physicalSpaceFeel || '[not provided]'}
Brand colors: ${col.brandColors || '[none yet]'}
Competitors use: ${col.competitorColors || '[not provided]'}
Light/dark: ${col.lightOrDark || '[not provided]'}
Avoid: ${col.colorHate || '[not provided]'}

--- DESIGN SYSTEM CONSTRAINTS ---
Spacing:      ${ds.spacing || '[not set]'}
Corners:      ${ds.corners || '[not set]'}
Shadows:      ${ds.shadows || '[not set]'}
Photo style:  ${ds.photoStyle || '[not set]'}
Accent usage: ${ds.accentUsage || '[not set]'}

============================================================
Based on Parts 1 + 2, define the complete design system:
- Typography scale (sizes, weights, families, hierarchy)
- Color palette (primary, neutrals, accents, backgrounds)
- Spacing scale
- Border radius values
- Shadow values
- Component base styles

Present the system. I'll approve or adjust before Part 3.
============================================================`

  const prompt3 = `============================================================
PROMPT 3 of 3 — HOMEPAGE BUILD
${name} — Local Business Homepage
============================================================
You have Parts 1-2 and an approved design system. Now build
the homepage using these section specifications.

GLOBAL RULES:
- No sticky click-to-call
- No online booking widget
- Reviews: Google quotes, 5-star, no photos/video,
  horizontal infinite scroll, no cards, typography-driven
- Embed Google Maps for service area
- Contact: short form, whatever converts best
- Everything must feel CUSTOM — no template energy

--- HERO ---
Type: ${h.heroType || '[not provided]'}
${h.heroNotes ? `Notes: ${h.heroNotes}` : ''}

--- SERVICES (NO BASIC CARD GRID) ---
Display: ${h.servicesDisplay || '[not provided]'}
${h.servicesNotes ? `Notes: ${h.servicesNotes}` : ''}

--- WORK/GALLERY ---
Display: ${h.galleryDisplay || '[not provided]'}
${h.galleryNotes ? `Notes: ${h.galleryNotes}` : ''}

--- ABOUT ---
Approach: ${h.aboutApproach || '[not provided]'}
${h.aboutNotes ? `Notes: ${h.aboutNotes}` : ''}

--- MAP ---
Style: ${h.mapStyle || '[not specified]'}

--- CONTACT ---
Fields: ${h.contactFields || 'name + phone + message'}
${h.contactNotes ? `Notes: ${h.contactNotes}` : ''}

--- SECTION PRIORITY ---
${h.sectionPriority?.map((s, i) => `${i + 1}. ${s}`).join('\n') || '[default]'}

--- IMAGES AVAILABLE ---
${formatWorkPhotos(img.photos)}
Quality: ${img.quality || '[not specified]'}
Standout: ${img.proudOf || '[not specified]'}
[Attach actual work photos with this prompt]

--- ANIMATION ---
Motion feel: ${anim.motionFeel || '[not provided]'}
Loved example: ${anim.lovedExample || '[not provided]'}
Annoyances: ${anim.annoyances || '[not provided]'}

${formatMascot(brief.mascot)}
============================================================
Build the complete homepage. Section by section, top to bottom.
============================================================`

  return [prompt1, prompt2, prompt3]
}

// Phase 2 — Batched prompts (one per category, not one per page)

export function generateAllServicePagesPrompt(brief, clientName) {
  const b = brief.business
  const name = b?.name || clientName || '[BUSINESS NAME]'
  const services = brief.servicePages?.services || []
  if (services.length === 0) return null

  const serviceList = services.map((s, i) => {
    let entry = `\n${i + 1}. ${s.name}
   URL: /${s.slug || '[slug]'}`
    if (s.description) entry += `\n   Covers: ${s.description}`
    if (s.sellingPoints) entry += `\n   Selling points: ${s.sellingPoints}`
    return entry
  }).join('\n')

  return `============================================================
ALL SERVICE PAGES
${name}
============================================================
Build ALL service pages below in one go. Each gets its own
complete page file. Use the SAME design system from the homepage.

SERVICES TO BUILD:
${serviceList}

PAGE STRUCTURE (each service page):
- Hero banner with service name and short hook
- Service overview — what it includes, who it's for
- Work gallery section if photos available
- Reviews/testimonials relevant to this service
- Clear CTA — this visitor is already interested
- Internal links to related services and area pages

RULES:
- Same design system as homepage (spacing, colors, typography)
- Each page must have UNIQUE content — not name-swapped copies
- Service-specific imagery where available
- Every page must feel custom, not template
- Output each page as a separate clearly labeled file
============================================================`
}

export function generateAllAreaPagesPrompt(brief, clientName) {
  const b = brief.business
  const name = b?.name || clientName || '[BUSINESS NAME]'
  const sa = brief.serviceAreas || {}
  const areas = sa.areas || []
  if (areas.length === 0) return null

  const approachLabels = {
    'full-page': 'Fully unique designed page per area',
    'template-custom': 'Shared layout structure, unique content per area',
    'hub-spoke': 'One main areas page + lighter individual city pages',
  }

  const areaList = areas.map((a, i) => {
    let entry = `${i + 1}. ${a.city} → /areas/${a.slug || '[slug]'}`
    if (a.localDetails) entry += `\n   Local details: ${a.localDetails}`
    if (a.servicesFocus) entry += `\n   Focus services: ${a.servicesFocus}`
    return entry
  }).join('\n')

  return `============================================================
ALL SERVICE AREA PAGES
${name}
============================================================
Build ALL service area pages below in one go. Use the SAME
design system from the homepage.

Primary HQ: ${sa.primaryCity || '[not set]'}
Approach: ${approachLabels[sa.areaPageApproach] || '[not specified]'}

AREAS TO BUILD:
${areaList}

PAGE STRUCTURE (each area page):
- Hero with city name and service tagline
- Brief intro mentioning local landmarks/neighborhoods
- Services available in this area (link to service pages)
- Embedded Google Map centered on this area
- CTA mentioning the area name

RULES:
- Same design system as the rest of the site
- Each page MUST have unique content — NOT city-name-swapped
- Mention real local details where provided
- Link to relevant service pages from each area page
- Output each page as a separate clearly labeled file
============================================================`
}

export function generateAboutContactPrompt(brief, clientName) {
  const b = brief.business || {}
  const h = brief.homepage || {}
  const name = b.name || clientName || '[BUSINESS NAME]'
  const services = brief.servicePages?.services || []
  const areas = brief.serviceAreas?.areas || []
  return `============================================================
ABOUT + CONTACT PAGES
${name}
============================================================
Build both the About page and Contact page. Use the SAME
design system from the homepage.

=== ABOUT PAGE (/about) ===

BUSINESS INFO (use ONLY what's here — do NOT fabricate):
- Business: ${name}
- What they do: ${b.whatYouDo || '[not provided]'}
- Location: ${b.city || '[not provided]'}
- Years in business: ${b.yearsInBusiness || '[not provided]'}
- Differentiator: ${b.differentiator || '[not provided]'}
- Google reviews: ${b.googleReviewCount || '?'} at ${b.googleRating || '?'} stars
${services.length > 0 ? `- Services: ${services.map(s => s.name).join(', ')}` : ''}
${areas.length > 0 ? `- Areas served: ${areas.map(a => a.city).join(', ')}` : ''}

Sections: Hero → Story (real info only) → Why Choose Us →
Service Area with map → CTA

RULES: Never fabricate awards, history, team bios, or claims.
If info is missing, keep it general or skip the section.
The mascot/character can appear here if one was defined.

=== CONTACT PAGE (/contact) ===

Sections: Hero → Contact Form → Business Info → Google Map →
Service Areas list

Contact form: ${h.contactFields || 'name + phone + message'}
${h.contactNotes ? `Form notes: ${h.contactNotes}` : ''}
Map centered on: ${b.city || '[business location]'}

RULES: Do NOT add fake phone numbers, emails, or addresses.
Use [PHONE], [EMAIL], [ADDRESS] placeholders where needed.
Mobile-first — form fields large enough for thumbs.
============================================================`
}

export function generateAllBlogPostsPrompt(brief, clientName) {
  const b = brief.business || {}
  const name = b.name || clientName || '[BUSINESS NAME]'
  const bs = brief.blogStrategy || {}
  const posts = bs.posts || []
  if (posts.length === 0) return null

  const styleLabels = {
    'expert-casual': 'Expert but casual — knowledgeable without being stiff',
    'professional': 'Professional — clean, authoritative, to the point',
    'friendly-local': 'Friendly & local — warm, conversational, community-focused',
  }

  const postList = posts.map((p, i) =>
    `${i + 1}. "${p.title}"
   URL: /blog/${p.slug || '[slug]'}
   Keyword: ${p.targetKeyword || '[none]'}
   Category: ${p.category || '[none]'}`
  ).join('\n\n')

  return `============================================================
ALL BLOG POSTS
${name}
============================================================
Write ALL blog posts below. Each is an SEO-optimized article
for a local business website. Use the same brand voice and
design system.

Writing style: ${styleLabels[bs.style] || bs.style || '[not specified]'}
Business: ${name} — ${b.whatYouDo || '[service]'}
Location: ${b.city || '[city]'}

POSTS TO WRITE:

${postList}

SEO RULES (apply to ALL posts):
- Target keyword in H1, first paragraph, 2-3 subheadings
- Natural language — no keyword stuffing
- H2/H3 structure for scanability
- 800-1500 words per post
- Internal links to service pages and area pages
- End each with a CTA related to the topic
- Meta title under 60 chars, meta description under 155 chars
- Write for readers first, search engines second
- Do NOT fabricate stats, claims, or testimonials

Output each post as a separate clearly labeled file.
============================================================`
}

export function generateHomepageUpdatePrompt(brief, clientName) {
  const b = brief.business || {}
  const name = b.name || clientName || '[BUSINESS NAME]'
  const services = brief.servicePages?.services || []
  const areas = brief.serviceAreas?.areas || []
  const posts = brief.blogStrategy?.posts || []

  return `============================================================
HOMEPAGE UPDATE — FINAL STEP
${name}
============================================================
Update the homepage to connect to all Phase 2 pages.

1. NAVIGATION — Add site nav:
   - Home
${services.length > 0 ? `   - Services dropdown:\n${services.map(s => `     → ${s.name} (/${s.slug})`).join('\n')}` : '   - Services'}
   - Areas / Locations
   - Blog
   - About (/about)
   - Contact (/contact)

2. BLOG PREVIEW SECTION — Add to homepage:
   - Latest 3 posts with title, category, excerpt
   - "View all posts" link
   - Same design system — not a generic card grid
   - Place after reviews/about, before map/contact
${posts.length > 0 ? `   Posts:\n${posts.slice(0, 3).map(p => `   - ${p.title}`).join('\n')}` : ''}

3. SERVICE LINKS — Each homepage service links to its page:
${services.map(s => `   - ${s.name} → /${s.slug}`).join('\n') || '   - [service pages]'}

4. FOOTER — Complete site links:
   - All service pages
   - Area pages${areas.length > 0 ? ` (${areas.map(a => a.city).join(', ')})` : ''}
   - Blog, About, Contact
   - Business info placeholders ([ADDRESS], [PHONE])

RULES: Keep existing homepage intact. Just ADD nav, blog
section, update links, and add footer.
============================================================`
}

export function generateSEOAuditPrompt(brief, clientName) {
  const b = brief.business || {}
  const name = b.name || clientName || '[BUSINESS NAME]'
  const services = brief.servicePages?.services || []
  const areas = brief.serviceAreas?.areas || []
  const posts = brief.blogStrategy?.posts || []

  const allPages = []
  allPages.push('/ (Homepage)')
  services.forEach(s => allPages.push(`/${s.slug} (${s.name})`))
  areas.forEach(a => allPages.push(`/areas/${a.slug} (${a.city})`))
  allPages.push('/about (About)')
  allPages.push('/contact (Contact)')
  posts.forEach(p => allPages.push(`/blog/${p.slug} (${p.title})`))

  return `============================================================
SEO AUDIT & OPTIMIZATION
${name}
============================================================
Audit every page of this site and fix ALL SEO issues. Do NOT
ask me what to do — just fix everything. Only ask me for
information you genuinely cannot generate (like a real phone
number or address).

SITE PAGES TO AUDIT:
${allPages.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}

Business: ${name}
Trade: ${b.whatYouDo || '[service]'}
City: ${b.city || '[city]'}
Google reviews: ${b.googleReviewCount || '?'} at ${b.googleRating || '?'} stars

============================================================
1. HTML TAG STRUCTURE (fix every page)
============================================================
- Exactly ONE <h1> per page — must contain primary keyword
- Logical H2 → H3 → H4 hierarchy (no skipping levels)
- No empty heading tags
- H1 should NOT be the business name on every page — each
  page gets a unique, keyword-rich H1
- Subheadings (H2/H3) must include secondary keywords naturally

Target H1s:
  Homepage: "${b.whatYouDo || '[service]'} in ${b.city || '[city]'} — ${name}"
${services.map(s => `  /${s.slug}: "${s.name} in ${b.city || '[city]'} — ${name}"`).join('\n')}
${areas.map(a => `  /areas/${a.slug}: "${b.whatYouDo || '[service]'} in ${a.city} — ${name}"`).join('\n')}
  /about: "About ${name} — ${b.whatYouDo || '[service]'} in ${b.city || '[city]'}"
  /contact: "Contact ${name} — ${b.city || '[city]'} ${b.whatYouDo || '[service]'}"
${posts.slice(0, 3).map(p => `  /blog/${p.slug}: "${p.title}"`).join('\n')}

============================================================
2. META TAGS (fix every page)
============================================================
For EVERY page, generate and insert:

<title> — under 60 chars, keyword + brand
  Format: "Primary Keyword | ${name}"

<meta name="description"> — under 155 chars, compelling,
  includes keyword + city + CTA

<meta name="robots" content="index, follow">
<link rel="canonical" href="[full URL]">

Open Graph (every page):
  <meta property="og:title">
  <meta property="og:description">
  <meta property="og:type" content="website">
  <meta property="og:url">
  <meta property="og:image"> (use hero/feature image)
  <meta property="og:locale" content="en_US">

Twitter Card:
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title">
  <meta name="twitter:description">

============================================================
3. SCHEMA MARKUP (add to every relevant page)
============================================================
Add JSON-LD structured data:

Homepage:
  - LocalBusiness schema with:
    name, description, url, telephone: "[PHONE]",
    address: { streetAddress: "[ADDRESS]", addressLocality: "${b.city || '[city]'}",
    addressRegion: "[STATE]", postalCode: "[ZIP]" },
    geo coordinates: "[LAT]", "[LNG]",
    openingHours, priceRange, aggregateRating
    (${b.googleReviewCount || '?'} reviews, ${b.googleRating || '?'} stars),
    areaServed: [${areas.length > 0 ? areas.map(a => `"${a.city}"`).join(', ') : '"[areas]"'}],
    hasOfferCatalog with all services

Service pages:
  - Service schema (name, description, provider, areaServed)
  - BreadcrumbList (Home → Services → [Service Name])

Area pages:
  - LocalBusiness with specific areaServed
  - BreadcrumbList (Home → Areas → [City])

Blog posts:
  - Article schema (headline, datePublished, author, publisher)
  - BreadcrumbList (Home → Blog → [Post Title])
  - FAQ schema if post has Q&A content

About page:
  - Organization schema
  - BreadcrumbList

Contact page:
  - ContactPage schema
  - BreadcrumbList

============================================================
4. IMAGE OPTIMIZATION (fix every image)
============================================================
- Every <img> MUST have a descriptive alt="" with keyword
  Format: "${b.whatYouDo || '[service]'} [what's in image] in ${b.city || '[city]'}"
- Add width and height attributes to prevent layout shift
- Use loading="lazy" on below-fold images
- Hero images: loading="eager", fetchpriority="high"
- Add WebP format with <picture> fallback where possible

============================================================
5. INTERNAL LINKING (audit and fix)
============================================================
Every page must link to at least 2-3 other pages naturally:
- Service pages → related services + area pages
- Area pages → all services + nearby areas
- Blog posts → relevant service page + contact
- Homepage → all service pages, area hub, blog, about, contact
- About → services, contact
- Contact → about, services

Add breadcrumb navigation to every subpage.
Use descriptive anchor text — never "click here" or "learn more"
  Good: "${b.whatYouDo || '[service]'} in ${areas[0]?.city || '[city]'}"
  Bad: "click here"

============================================================
6. TECHNICAL SEO (generate these files)
============================================================
Create these files:

sitemap.xml — list ALL pages with:
  <lastmod>, <changefreq>, <priority>
  Homepage: priority 1.0
  Service pages: 0.9
  Area pages: 0.8
  Blog posts: 0.7
  About/Contact: 0.6

robots.txt:
  User-agent: *
  Allow: /
  Sitemap: [DOMAIN]/sitemap.xml

============================================================
7. PAGE SPEED & CORE WEB VITALS
============================================================
- Minify CSS and JS where possible
- Defer non-critical JS: <script defer>
- Preload hero fonts: <link rel="preload" as="font">
- Preconnect to external origins (Google Maps, fonts)
- Add <meta name="viewport" content="width=device-width, initial-scale=1">
- Ensure no render-blocking resources above fold

============================================================
8. CONTENT SEO (audit and fix copy)
============================================================
For every page, ensure:
- Primary keyword appears in first 100 words
- Keyword density 1-2% (natural, not stuffed)
- At least 300 words on service/area pages
- Blog posts 800-1500 words
- Every page ends with a clear CTA
- No duplicate content across pages
- No placeholder text left ([PHONE] etc are OK)

============================================================
OUTPUT FORMAT
============================================================
For each page, output the COMPLETE updated file with all SEO
fixes applied. Label each file clearly.

Then output sitemap.xml and robots.txt as separate files.

After all fixes, provide a summary checklist:
  ✓ [page] — H1, meta, schema, images, links
  for every page so I can verify coverage.

DO NOT ASK ME:
- What keywords to use (derive from business + service + city)
- What meta descriptions to write (generate them)
- What schema to add (add everything listed above)
- What alt text to use (describe the image + keyword)

ONLY ASK ME FOR:
- Real phone number (if [PHONE] placeholder needs replacing)
- Real address (if [ADDRESS] placeholder needs replacing)
- Real email (if [EMAIL] placeholder needs replacing)
- Domain name (for canonical URLs and sitemap)
- Anything else that requires real-world info I haven't provided
============================================================`
}

export function generateQCPrompt(brief, clientName) {
  const b = brief.business || {}
  const name = b.name || clientName || '[BUSINESS NAME]'
  const services = brief.servicePages?.services || []
  const areas = brief.serviceAreas?.areas || []
  const posts = brief.blogStrategy?.posts || []

  const allPages = []
  allPages.push({ name: 'Homepage', url: '/' })
  services.forEach(s => allPages.push({ name: s.name, url: `/${s.slug}` }))
  areas.forEach(a => allPages.push({ name: a.city, url: `/areas/${a.slug}` }))
  allPages.push({ name: 'About', url: '/about' })
  allPages.push({ name: 'Contact', url: '/contact' })
  posts.forEach(p => allPages.push({ name: p.title, url: `/blog/${p.slug}` }))

  return `============================================================
QUALITY CONTROL — FULL SITE AUDIT
${name}
============================================================
Go through EVERY page of this site and fix ALL issues. Test
everything as if you're the client about to launch. Be brutal.
Fix problems directly — don't just list them.

PAGES TO AUDIT (${allPages.length} total):
${allPages.map((p, i) => `  ${i + 1}. ${p.name} → ${p.url}`).join('\n')}

============================================================
1. NAVIGATION & LINKS
============================================================
Test on EVERY page:
□ Logo links to homepage
□ All nav links go to correct pages (not 404)
□ Mobile hamburger menu opens/closes properly
□ Dropdown menus work on hover AND click
□ Active page is highlighted in nav
□ All footer links work
□ All internal text links work
□ No dead/broken links anywhere
□ Back button behavior works as expected
□ Breadcrumbs show correct path and link correctly

Fix any broken links. If a page doesn't exist, create it or
remove the link.

============================================================
2. BUTTONS & CTAs
============================================================
Test every button on every page:
□ All CTA buttons are clickable (not just styled divs)
□ "Get a Quote" / contact buttons go to contact page or form
□ "Learn More" links go to the right page
□ Service page CTAs link to contact with service context
□ Area page CTAs link to contact with area context
□ Blog CTAs link to relevant service or contact
□ Button hover states work
□ Button focus states work (keyboard accessible)
□ No buttons that do nothing
□ Phone number links use tel: protocol
□ Email links use mailto: protocol

============================================================
3. FORMS
============================================================
□ Contact form submits (or shows clear placeholder behavior)
□ Required fields are marked and validated
□ Form shows success message after submission
□ Form shows error messages for invalid input
□ Email field validates email format
□ Phone field accepts common formats
□ Form is usable on mobile (large tap targets)
□ Form doesn't lose data on accidental page navigation
□ No console errors on form submission

============================================================
4. RESPONSIVE DESIGN
============================================================
Test every page at these breakpoints:
  - Mobile: 375px (iPhone SE)
  - Mobile large: 428px (iPhone 14 Pro Max)
  - Tablet: 768px (iPad)
  - Desktop: 1280px
  - Wide: 1536px

Check for:
□ No horizontal scrollbar at any breakpoint
□ Text is readable without zooming on mobile
□ Images don't overflow their containers
□ Navigation collapses to mobile menu properly
□ Grid layouts stack correctly on mobile
□ Hero section looks good at all sizes
□ Footer stacks cleanly on mobile
□ Google Map embed is responsive
□ Gallery/portfolio images scale properly
□ Blog post layout is readable on mobile
□ No overlapping elements at any size

============================================================
5. IMAGES & MEDIA
============================================================
□ All images load (no broken image icons)
□ All images have alt text (not empty alt="")
□ Images are appropriately sized (not 4000px displayed at 400px)
□ Hero images load quickly (eager loading)
□ Below-fold images use lazy loading
□ Gallery/lightbox functionality works
□ No stretched or distorted images
□ Placeholder images are clearly marked for replacement

============================================================
6. TYPOGRAPHY & CONTENT
============================================================
□ No lorem ipsum or placeholder text remaining
□ No "[PLACEHOLDER]" text visible to users
  (backend placeholders like [PHONE] are fine in code)
□ Fonts load correctly (no FOUT/FOIT issues)
□ Text contrast meets WCAG AA (4.5:1 minimum)
□ No text overflow or clipping
□ Line lengths are readable (45-75 characters)
□ No orphaned headings (heading with no content after)
□ Consistent capitalization style
□ No spelling errors in visible text

============================================================
7. PERFORMANCE & TECHNICAL
============================================================
□ No console errors on any page
□ No console warnings that indicate real issues
□ All external resources load (fonts, maps, icons)
□ Animations don't cause layout shift
□ Smooth scrolling works
□ Page transitions don't break layout
□ No memory leaks from event listeners
□ Proper 404 page exists for bad URLs
□ Favicon is set

============================================================
8. ACCESSIBILITY BASICS
============================================================
□ All interactive elements are keyboard accessible
□ Tab order makes sense (top to bottom, left to right)
□ Focus indicators are visible
□ Skip-to-content link exists
□ ARIA labels on icon-only buttons
□ Form labels are properly associated with inputs
□ Color is not the only way to convey information
□ Sufficient color contrast throughout

============================================================
9. CROSS-PAGE CONSISTENCY
============================================================
□ Same header/footer on every page
□ Consistent button styles across all pages
□ Consistent spacing and padding
□ Same color palette used throughout
□ Typography hierarchy is consistent
□ CTA style is consistent
□ Hover effects are consistent
□ Animation style is consistent

============================================================
OUTPUT FORMAT
============================================================
For each issue found:
1. Fix it directly in the code
2. Note what you fixed

After all fixes, provide a final report:

PAGES AUDITED: X/X
ISSUES FOUND: X
ISSUES FIXED: X

Per-page summary:
  ✓ Homepage — [X issues fixed: brief description]
  ✓ [Service] — [X issues fixed: brief description]
  ... etc

REMAINING ITEMS (things only the client can fix):
  - [anything that needs real info like phone/email]

Output all updated files with fixes applied.
============================================================`
}
