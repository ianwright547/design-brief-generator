import { useState, useEffect, useCallback } from 'react'
import { getClients, saveClient, deleteClient, createNewClient, getClient } from './store'
import Wizard from './components/Wizard'

function ClientManager({ onSelect }) {
  const [clients, setClients] = useState([])
  const [newName, setNewName] = useState('')
  const [showDelete, setShowDelete] = useState(null)

  useEffect(() => {
    setClients(getClients())
  }, [])

  const handleCreate = () => {
    if (!newName.trim()) return
    const client = createNewClient(newName.trim())
    saveClient(client)
    setNewName('')
    setClients(getClients())
    onSelect(client.id)
  }

  const handleDelete = (id) => {
    deleteClient(id)
    setClients(getClients())
    setShowDelete(null)
  }

  const getProgress = (client) => {
    const b = client.brief
    let filled = 0
    let total = 11
    if (b.business?.name) filled++
    if (b.customer?.whoIsSearching) filled++
    if (b.visual?.styleDirection) filled++
    if (b.moodboard?.images?.length > 0) filled++
    if (b.references?.some(r => r.url)) filled++
    if (b.typography?.energy) filled++
    if (b.color?.lightOrDark) filled++
    if (b.homepage?.heroType) filled++
    if (b.designSystem?.spacing) filled++
    if (b.images?.quality) filled++
    if (b.animation?.motionFeel) filled++
    return Math.round((filled / total) * 100)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-4/50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl text-zinc-50">Design Brief Generator</h1>
            <p className="text-sm text-zinc-500 mt-1">Build agency-grade design briefs for local businesses</p>
          </div>
          <span className="text-xs text-zinc-600 font-mono">v1.0</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* New client */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">New Client</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Client or business name..."
              className="input-field flex-1 max-w-md"
            />
            <button onClick={handleCreate} className="btn-primary" disabled={!newName.trim()}>
              Add Client
            </button>
          </div>
        </div>

        {/* Client list */}
        {clients.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Your Clients ({clients.length})
            </h2>
            <div className="grid gap-3">
              {clients.map(client => {
                const progress = getProgress(client)
                return (
                  <div
                    key={client.id}
                    className="card group hover:border-surface-4 transition-all duration-200 cursor-pointer"
                    onClick={() => onSelect(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-100 truncate">
                            {client.clientName}
                          </h3>
                          {client.brief?.business?.name && client.brief.business.name !== client.clientName && (
                            <span className="tag">{client.brief.business.name}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <div className="h-1.5 flex-1 bg-surface-4 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: progress === 100 ? '#22c55e' : '#e8a04e'
                                }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500 font-mono w-8">{progress}%</span>
                          </div>
                          <span className="text-xs text-zinc-600">
                            Step {(client.currentStep || 0) + 1}/16
                          </span>
                          <span className="text-xs text-zinc-600">
                            Updated {new Date(client.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100
                                     hover:bg-surface-3 rounded-lg transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelect(client.id)
                          }}
                        >
                          Continue
                        </button>
                        {showDelete === client.id ? (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              className="px-2 py-1 text-xs text-red-400 hover:text-red-300
                                         hover:bg-red-400/10 rounded transition-all"
                              onClick={() => handleDelete(client.id)}
                            >
                              Confirm
                            </button>
                            <button
                              className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300
                                         rounded transition-all"
                              onClick={() => setShowDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-2 py-1.5 text-sm text-zinc-600 hover:text-red-400
                                       hover:bg-red-400/10 rounded-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDelete(client.id)
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {clients.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-lg">No clients yet</p>
            <p className="text-zinc-700 text-sm mt-1">Add a client above to start building their design brief</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  const [activeClientId, setActiveClientId] = useState(null)

  if (activeClientId) {
    return (
      <Wizard
        clientId={activeClientId}
        onBack={() => setActiveClientId(null)}
      />
    )
  }

  return <ClientManager onSelect={setActiveClientId} />
}
