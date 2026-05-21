import { useState, useEffect } from 'react'
import { getApiKey, setApiKey, getModel, setModel, autofillBrief } from '../aiAutofill'

export default function AIAutofillModal({ brief, onClose, onApply }) {
  const [apiKey, setKeyLocal] = useState('')
  const [model, setModelLocal] = useState('gpt-4o-mini')
  const [showKey, setShowKey] = useState(false)
  const [context, setContext] = useState('')
  const [overwrite, setOverwrite] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    setKeyLocal(getApiKey())
    setModelLocal(getModel())
  }, [])

  const handleSaveKey = () => {
    setApiKey(apiKey.trim())
    setModel(model)
  }

  const handleRun = async () => {
    setError('')
    setResult(null)
    setApiKey(apiKey.trim())
    setModel(model)
    setRunning(true)
    try {
      const out = await autofillBrief({
        brief,
        context,
        apiKey: apiKey.trim(),
        model,
        overwrite,
      })
      setResult(out)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setRunning(false)
    }
  }

  const handleApply = () => {
    if (!result) return
    onApply(result.updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-1 border border-surface-4 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-surface-4/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">AI Autofill</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Generate brief fields from business info + context</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              OpenAI API Key
            </label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setKeyLocal(e.target.value)}
                placeholder="sk-..."
                className="input-field flex-1 font-mono text-sm"
                autoComplete="off"
              />
              <button
                onClick={() => setShowKey(s => !s)}
                className="px-3 text-xs text-zinc-400 hover:text-zinc-200 border border-surface-4 rounded-lg"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
              <button onClick={handleSaveKey} className="btn-secondary text-sm">Save</button>
            </div>
            <p className="text-[11px] text-zinc-600 mt-1.5">
              Stored in this browser's localStorage. Never sent anywhere except api.openai.com.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={e => setModelLocal(e.target.value)}
              className="input-field"
            >
              <option value="gpt-4o-mini">gpt-4o-mini (cheap, recommended)</option>
              <option value="gpt-4o">gpt-4o (better prose, ~20x cost)</option>
              <option value="gpt-4.1-mini">gpt-4.1-mini</option>
              <option value="gpt-4.1">gpt-4.1</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Context (paste website copy, GMB info, your notes)
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Paste their website homepage text, Google Business Profile, any notes about the business. The more specific, the better the output."
              rows={8}
              className="input-field font-mono text-xs leading-relaxed"
            />
            <p className="text-[11px] text-zinc-600 mt-1.5">
              Optional but strongly recommended. Without context the AI invents generic copy.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={e => setOverwrite(e.target.checked)}
              className="rounded"
            />
            Overwrite existing values (default: only fill blank fields)
          </label>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-200/80">
            <strong className="text-amber-200">Required first:</strong> fill in Step 1 (business name, what you do, city) before running. AI uses those as the seed.
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-200">
              <div className="font-semibold mb-1">Autofill ready &mdash; {result.filledCount} fields generated.</div>
              {result.usage && (
                <div className="text-emerald-200/60 font-mono text-[10px]">
                  {result.usage.prompt_tokens} in / {result.usage.completion_tokens} out tokens
                </div>
              )}
              <div className="mt-2 text-emerald-200/80">Click Apply to merge into your brief.</div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-surface-4/50 flex items-center justify-between gap-2">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <div className="flex gap-2">
            {result ? (
              <button onClick={handleApply} className="btn-primary text-sm">Apply to brief</button>
            ) : (
              <button
                onClick={handleRun}
                disabled={running || !apiKey.trim()}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {running ? 'Generating...' : 'Run Autofill'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
