import { useState, useMemo } from 'react'
import {
  generateFullPrompt,
  generateSplitPrompts,
  generateAllServicePagesPrompt,
  generateAllAreaPagesPrompt,
  generateAboutContactPrompt,
  generateAllBlogPostsPrompt,
  generateHomepageUpdatePrompt,
  generateSEOAuditPrompt,
  generateQCPrompt,
} from '../promptGenerator'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'btn-primary'
        }`}
    >
      {copied ? 'Copied!' : 'Copy to Clipboard'}
    </button>
  )
}

function CompletionCheck({ brief }) {
  const checks = [
    { label: 'Business info', done: !!brief.business?.name && !!brief.business?.whatYouDo },
    { label: 'Customer profile', done: !!brief.customer?.whoIsSearching },
    { label: 'Visual direction', done: !!brief.visual?.styleDirection },
    { label: 'Moodboard', done: brief.moodboard?.images?.length >= 3 },
    { label: 'References', done: brief.references?.some(r => r.url && r.taking) },
    { label: 'Typography', done: !!brief.typography?.energy },
    { label: 'Color system', done: !!brief.color?.lightOrDark },
    { label: 'Homepage sections', done: !!brief.homepage?.heroType && !!brief.homepage?.servicesDisplay },
    { label: 'Design system', done: !!brief.designSystem?.spacing },
    { label: 'Images', done: !!brief.images?.quality },
    { label: 'Animation intent', done: !!brief.animation?.motionFeel },
    { label: 'HTML references', done: brief.htmlReferences?.files?.length > 0, optional: true },
    { label: 'Mascot / Character', done: !!brief.mascot?.wantsMascot, optional: true },
    { label: 'Service pages', done: brief.servicePages?.services?.length > 0, optional: true },
    { label: 'Service areas', done: brief.serviceAreas?.areas?.length > 0, optional: true },
    { label: 'Blog posts', done: brief.blogStrategy?.posts?.length > 0, optional: true },
  ]

  const required = checks.filter(c => !c.optional)
  const complete = required.filter(c => c.done).length
  const total = required.length
  const pct = Math.round((complete / total) * 100)

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-300">Brief Completeness</h3>
        <span className={`text-sm font-mono font-bold ${pct === 100 ? 'text-green-400' : pct >= 70 ? 'text-accent' : 'text-zinc-500'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-surface-4 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct === 100 ? '#22c55e' : '#e8a04e'
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={c.done ? 'text-green-400' : 'text-zinc-600'}>
              {c.done ? '●' : '○'}
            </span>
            <span className={c.done ? 'text-zinc-300' : 'text-zinc-600'}>
              {c.label}{c.optional ? ' (bonus)' : ''}
            </span>
          </div>
        ))}
      </div>
      {pct < 70 && (
        <p className="text-xs text-amber-400/70 mt-3">
          A weak brief = a generic output. Fill in the gaps before generating.
        </p>
      )}
    </div>
  )
}

function PromptCard({ title, subtitle, text }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-200">
          {title}
          {subtitle && <span className="text-zinc-500 font-normal ml-2">{subtitle}</span>}
        </h3>
        <CopyButton text={text} />
      </div>
      <pre className="text-xs text-zinc-400 bg-surface-0 rounded-lg p-4 overflow-x-auto
                     whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto border border-surface-4">
        {text}
      </pre>
    </div>
  )
}

export default function Step12Review({ brief, clientName }) {
  const [phase, setPhase] = useState('homepage')
  const [mode, setMode] = useState('split')

  const fullPrompt = useMemo(() => generateFullPrompt(brief, clientName), [brief, clientName])
  const splitPrompts = useMemo(() => generateSplitPrompts(brief, clientName), [brief, clientName])

  const services = brief.servicePages?.services || []
  const areas = brief.serviceAreas?.areas || []
  const posts = brief.blogStrategy?.posts || []

  // Build Phase 2 prompts array
  const phase2Prompts = useMemo(() => {
    const prompts = []
    const svcPrompt = generateAllServicePagesPrompt(brief, clientName)
    if (svcPrompt) prompts.push({ title: 'All Service Pages', subtitle: `${services.length} pages`, text: svcPrompt })
    const areaPrompt = generateAllAreaPagesPrompt(brief, clientName)
    if (areaPrompt) prompts.push({ title: 'All Area Pages', subtitle: `${areas.length} pages`, text: areaPrompt })
    prompts.push({ title: 'About + Contact', subtitle: '2 pages', text: generateAboutContactPrompt(brief, clientName) })
    const blogPrompt = generateAllBlogPostsPrompt(brief, clientName)
    if (blogPrompt) prompts.push({ title: 'All Blog Posts', subtitle: `${posts.length} posts`, text: blogPrompt })
    prompts.push({ title: 'Homepage Update', subtitle: 'nav, blog section, footer', text: generateHomepageUpdatePrompt(brief, clientName) })
    return prompts
  }, [brief, clientName, services.length, areas.length, posts.length])

  // Build Phase 3 prompts
  const phase3Prompts = useMemo(() => [
    { title: 'SEO Audit & Optimization', subtitle: 'every page', text: generateSEOAuditPrompt(brief, clientName) },
    { title: 'Quality Control', subtitle: 'full site audit', text: generateQCPrompt(brief, clientName) },
  ], [brief, clientName])

  return (
    <div>
      <h2 className="section-title">Generate Prompts</h2>
      <p className="section-desc">
        Review your brief completeness, then generate the prompt(s) to give to Claude for website design.
      </p>

      <CompletionCheck brief={brief} />

      {/* Phase toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPhase('homepage')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${phase === 'homepage' ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-3 text-zinc-400 border border-surface-4 hover:text-zinc-200'}`}
        >
          Phase 1 — Homepage
        </button>
        <button
          onClick={() => setPhase('pages')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${phase === 'pages' ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-3 text-zinc-400 border border-surface-4 hover:text-zinc-200'}`}
        >
          Phase 2 — Pages & Blog
          <span className="ml-1.5 text-xs opacity-60">
            ({phase2Prompts.length} prompts)
          </span>
        </button>
        <button
          onClick={() => setPhase('seo-qc')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${phase === 'seo-qc' ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-3 text-zinc-400 border border-surface-4 hover:text-zinc-200'}`}
        >
          Phase 3 — SEO & QC
          <span className="ml-1.5 text-xs opacity-60">
            (2 prompts)
          </span>
        </button>
      </div>

      {phase === 'homepage' && (
        <>
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('split')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === 'split' ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-3 text-zinc-400 border border-surface-4 hover:text-zinc-200'}`}
            >
              3 Prompts (Recommended)
            </button>
            <button
              onClick={() => setMode('full')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === 'full' ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-surface-3 text-zinc-400 border border-surface-4 hover:text-zinc-200'}`}
            >
              Single Prompt
            </button>
          </div>

          {mode === 'split' ? (
            <div className="space-y-6">
              <p className="text-xs text-zinc-500">
                Send these one at a time. Wait for confirmation after each before sending the next.
                Attach moodboard images with Prompt 1 and work photos with Prompt 3.
              </p>
              {splitPrompts.map((prompt, i) => (
                <PromptCard
                  key={i}
                  title={`Prompt ${i + 1} of 3`}
                  subtitle={i === 0 ? '— Context & Direction' : i === 1 ? '— Design System' : '— Homepage Build'}
                  text={prompt}
                />
              ))}
            </div>
          ) : (
            <PromptCard title="Complete Brief" subtitle="— all sections in one prompt" text={fullPrompt} />
          )}

          {/* Instructions */}
          <div className="card mt-6 border-accent/20">
            <h3 className="text-sm font-semibold text-accent mb-2">How to use these prompts</h3>
            <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside">
              <li>Copy Prompt 1 and paste it into a new Claude conversation</li>
              <li>Attach your moodboard images (the actual files, not just the descriptions)</li>
              <li>Wait for Claude to confirm it absorbed the context</li>
              <li>Send Prompt 2 — Claude will build the design system</li>
              <li>Review and approve the design system (push back if needed)</li>
              <li>Send Prompt 3 with your work photos attached</li>
              <li>Claude builds the homepage section by section</li>
              <li>Iterate 2-3 rounds maximum, then move to Phase 2</li>
            </ol>
          </div>
        </>
      )}

      {phase === 'pages' && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-500">
            {phase2Prompts.length} prompts total. Send them in order — each one builds all pages
            of that type in one shot. Total prompts for the entire site: {3 + phase2Prompts.length + 2}.
          </p>

          {phase2Prompts.map((p, i) => (
            <PromptCard
              key={i}
              title={`Prompt ${4 + i} of ${3 + phase2Prompts.length + 2}`}
              subtitle={`— ${p.title} (${p.subtitle})`}
              text={p.text}
            />
          ))}

          {/* Phase 2 Instructions */}
          <div className="card border-accent/20">
            <h3 className="text-sm font-semibold text-accent mb-2">How to use Phase 2</h3>
            <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside">
              <li>Finish Phase 1 first — homepage must be built with approved design system</li>
              <li>In the same conversation, send each Phase 2 prompt in order</li>
              <li>Wait for each batch to finish before sending the next</li>
              <li>Homepage Update goes LAST — it ties everything together</li>
              <li>Then move to Phase 3 for SEO optimization and quality control</li>
            </ol>
          </div>
        </div>
      )}

      {phase === 'seo-qc' && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-500">
            2 final prompts. Run SEO first (fixes tags, meta, schema, links), then QC
            (tests every button, link, form, and responsive breakpoint).
            Total prompts for the entire site: {3 + phase2Prompts.length + 2}.
          </p>

          {phase3Prompts.map((p, i) => (
            <PromptCard
              key={i}
              title={`Prompt ${3 + phase2Prompts.length + 1 + i} of ${3 + phase2Prompts.length + 2}`}
              subtitle={`— ${p.title} (${p.subtitle})`}
              text={p.text}
            />
          ))}

          {/* Phase 3 Instructions */}
          <div className="card border-accent/20">
            <h3 className="text-sm font-semibold text-accent mb-2">How to use Phase 3</h3>
            <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside">
              <li>Complete Phase 1 (homepage) and Phase 2 (all pages) first</li>
              <li>Send the SEO Audit prompt — Claude will fix H1s, meta tags, schema markup, internal links, alt text, and generate sitemap.xml + robots.txt</li>
              <li>Review the SEO changes — Claude will only ask for real info it can't generate (phone, email, address, domain)</li>
              <li>Send the QC prompt — Claude will test every page for broken links, button functionality, responsive layout, forms, accessibility, and cross-page consistency</li>
              <li>Review the QC report and confirm all fixes</li>
            </ol>
          </div>

          <div className="card border-green-500/20">
            <h3 className="text-sm font-semibold text-green-400 mb-2">What Claude handles automatically</h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
              <div>
                <p className="text-zinc-300 font-medium mb-1">SEO Audit</p>
                <ul className="space-y-0.5">
                  <li>H1/H2/H3 tag structure</li>
                  <li>Meta titles & descriptions</li>
                  <li>Schema markup (LocalBusiness, Service, Article)</li>
                  <li>Open Graph & Twitter cards</li>
                  <li>Image alt text with keywords</li>
                  <li>Internal linking between all pages</li>
                  <li>Breadcrumb navigation</li>
                  <li>sitemap.xml & robots.txt</li>
                  <li>Keyword placement & density</li>
                  <li>Core Web Vitals optimization</li>
                </ul>
              </div>
              <div>
                <p className="text-zinc-300 font-medium mb-1">Quality Control</p>
                <ul className="space-y-0.5">
                  <li>All links & navigation</li>
                  <li>Button functionality</li>
                  <li>Form validation & submission</li>
                  <li>Responsive at 5 breakpoints</li>
                  <li>Image loading & sizing</li>
                  <li>Typography & content</li>
                  <li>Console errors</li>
                  <li>Keyboard accessibility</li>
                  <li>Cross-page consistency</li>
                  <li>404 page & error handling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
