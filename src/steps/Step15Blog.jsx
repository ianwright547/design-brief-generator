export default function Step15Blog({ brief, updateBrief }) {
  const data = brief.blogStrategy || { posts: [], style: '', frequency: '' }
  const posts = data.posts || []

  const update = (field, value) => {
    updateBrief('blogStrategy', { ...data, [field]: value })
  }

  const removePost = (index) => {
    update('posts', posts.filter((_, i) => i !== index))
  }

  const generateAll = () => {
    const biz = brief.business || {}
    const services = (brief.servicePages?.services || []).filter(s => s.name)
    const areas = (brief.serviceAreas?.areas || []).filter(a => a.city)
    const city = biz.city || '[your city]'
    const trade = biz.whatYouDo || '[your service]'
    const year = new Date().getFullYear()

    const ideas = []

    // Cost/pricing per service
    services.forEach(s => {
      ideas.push({
        title: `How Much Does ${s.name} Cost in ${city}? (${year} Guide)`,
        slug: `${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cost-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        targetKeyword: `${s.name.toLowerCase()} cost ${city.toLowerCase()}`,
        category: 'Cost / Pricing Info',
      })
    })

    // Signs you need [service]
    services.forEach(s => {
      ideas.push({
        title: `Signs You Need ${s.name} — What to Look For`,
        slug: `signs-you-need-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        targetKeyword: `when to get ${s.name.toLowerCase()}`,
        category: 'Common Problems',
      })
    })

    // How to choose
    if (trade) {
      ideas.push({
        title: `How to Choose the Right ${trade} in ${city}`,
        slug: `how-to-choose-${trade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        targetKeyword: `best ${trade.toLowerCase()} ${city.toLowerCase()}`,
        category: 'How-To / Guides',
      })
    }

    // vs comparison per service
    services.slice(0, 3).forEach(s => {
      ideas.push({
        title: `DIY vs Professional ${s.name}: What ${city} Homeowners Should Know`,
        slug: `diy-vs-professional-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        targetKeyword: `diy ${s.name.toLowerCase()} vs professional`,
        category: 'How-To / Guides',
      })
    })

    // Area-specific posts for top areas
    areas.slice(0, 3).forEach(a => {
      ideas.push({
        title: `${trade} in ${a.city}: What Local Homeowners Need to Know`,
        slug: `${trade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${a.slug}`,
        targetKeyword: `${trade.toLowerCase()} ${a.city.toLowerCase()}`,
        category: 'Local Focus',
      })
    })

    // Seasonal
    ideas.push({
      title: `Seasonal ${trade} Tips for ${city} Homeowners`,
      slug: `seasonal-${trade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tips`,
      targetKeyword: `${trade.toLowerCase()} seasonal tips`,
      category: 'Seasonal Tips',
    })

    // FAQ
    ideas.push({
      title: `${trade} FAQ: Your Top Questions Answered`,
      slug: `${trade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-faq`,
      targetKeyword: `${trade.toLowerCase()} questions`,
      category: 'FAQ Deep Dives',
    })

    // Before/after
    ideas.push({
      title: `Before & After: Recent ${trade} Projects in ${city}`,
      slug: `before-after-${trade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      targetKeyword: `${trade.toLowerCase()} before after ${city.toLowerCase()}`,
      category: 'Before & After',
    })

    update('posts', ideas)
  }

  const hasServices = (brief.servicePages?.services || []).some(s => s.name)
  const hasBusiness = brief.business?.whatYouDo

  return (
    <div>
      <h2 className="section-title">Blog Posts</h2>
      <p className="section-desc">
        SEO-optimized blog posts auto-generated from your services, areas, and business info.
        All content is based on real info from the brief — no fabricated claims.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="input-label">Blog writing style</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'expert-casual', label: 'Expert but Casual', desc: 'Knowledgeable without being stiff. Like explaining to a neighbor.' },
              { id: 'professional', label: 'Professional', desc: 'Clean, authoritative, straight to the point.' },
              { id: 'friendly-local', label: 'Friendly & Local', desc: 'Warm, conversational, community-focused.' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('style', opt.id)}
                className={`option-card ${data.style === opt.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">Target post frequency</label>
          <div className="flex flex-wrap gap-2">
            {['1/week', '2/month', '1/month', 'Batch upfront', 'As needed'].map(freq => (
              <button
                key={freq}
                type="button"
                onClick={() => update('frequency', freq)}
                className={`tag cursor-pointer transition-all ${data.frequency === freq ? 'border-accent text-accent' : 'hover:border-zinc-500'}`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="card mb-6 text-center">
        {!hasServices && !hasBusiness ? (
          <p className="text-xs text-zinc-500">
            Fill in your business info (Step 1) and services (Step 13) first — blog topics
            are generated from that data.
          </p>
        ) : (
          <>
            <button
              onClick={generateAll}
              className="btn-primary text-sm"
            >
              {posts.length > 0 ? 'Regenerate All Blog Posts' : 'Generate Blog Posts'}
            </button>
            <p className="text-xs text-zinc-500 mt-2">
              Creates posts based on your {hasServices ? `${(brief.servicePages?.services || []).filter(s => s.name).length} services` : 'business'}, areas, and location. No fake claims.
            </p>
          </>
        )}
      </div>

      {/* Post list */}
      {posts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-300">{posts.length} Blog Posts</h3>
            <button
              onClick={() => update('posts', [])}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
          {posts.map((post, i) => (
            <div key={i} className="card relative group py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-600 w-6 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-zinc-200 block truncate">{post.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-600">/blog/{post.slug}</span>
                      <span className="text-[10px] text-accent/60">{post.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removePost(i)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors
                             opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
              <div className="mt-1.5 ml-9">
                <span className="text-[10px] text-zinc-500">Keyword: </span>
                <span className="text-[10px] text-zinc-400 font-mono">{post.targetKeyword}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
