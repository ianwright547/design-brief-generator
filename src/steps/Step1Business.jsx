export default function Step1Business({ brief, updateBrief }) {
  const data = brief.business
  const update = (field, value) => {
    updateBrief('business', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">The Business</h2>
      <p className="section-desc">
        Basic facts. Be specific — "emergency plumber in North Austin" not "plumbing company."
      </p>

      <div className="space-y-5">
        <div>
          <label className="input-label">Business Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g., Summit Roofing Co."
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">What do they do? (one line, no jargon)</label>
          <input
            type="text"
            value={data.whatYouDo}
            onChange={e => update('whatYouDo', e.target.value)}
            placeholder="e.g., Residential roof replacement and repair in the Dallas-Fort Worth area"
            className="input-field"
          />
          <p className="input-hint">
            Pretend you're telling a stranger at a bar what this business does. That's the right level of plain English.
          </p>
        </div>

        <div>
          <label className="input-label">City / Neighborhoods / Area Served</label>
          <input
            type="text"
            value={data.city}
            onChange={e => update('city', e.target.value)}
            placeholder="e.g., Dallas-Fort Worth — specifically Plano, Frisco, McKinney, Allen"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Years in Business</label>
            <input
              type="text"
              value={data.yearsInBusiness}
              onChange={e => update('yearsInBusiness', e.target.value)}
              placeholder="e.g., 12"
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Google Rating</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.googleRating}
                onChange={e => update('googleRating', e.target.value)}
                placeholder="4.9"
                className="input-field w-20"
              />
              <input
                type="text"
                value={data.googleReviewCount}
                onChange={e => update('googleReviewCount', e.target.value)}
                placeholder="187 reviews"
                className="input-field flex-1"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="input-label">
            The ONE thing that makes them different
          </label>
          <textarea
            value={data.differentiator}
            onChange={e => update('differentiator', e.target.value)}
            placeholder={"Not \"quality and experience.\" Something specific and provable.\n\ne.g., \"We show up within 2 hours for emergency calls — guaranteed. We've replaced 400+ roofs in Collin County since 2014.\""}
            rows={4}
            className="input-field resize-none"
          />
          <p className="input-hint">
            If you can't name one specific, provable thing — the website won't convert no matter how good it looks.
          </p>
        </div>
      </div>
    </div>
  )
}
