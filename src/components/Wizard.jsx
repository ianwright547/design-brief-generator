import { useState, useEffect, useCallback, useRef } from 'react'
import { getClient, saveClient } from '../store'
import AIAutofillModal from './AIAutofillModal'
import Step1Business from '../steps/Step1Business'
import Step2Customer from '../steps/Step2Customer'
import Step3Visual from '../steps/Step3Visual'
import Step4Moodboard from '../steps/Step4Moodboard'
import Step5References from '../steps/Step5References'
import Step6Typography from '../steps/Step6Typography'
import Step7Color from '../steps/Step7Color'
import Step8Homepage from '../steps/Step8Homepage'
import Step9DesignSystem from '../steps/Step9DesignSystem'
import Step10Images from '../steps/Step10Images'
import Step11Animation from '../steps/Step11Animation'
import Step12Mascot from '../steps/Step12Mascot'
import Step13Services from '../steps/Step13Services'
import Step14Areas from '../steps/Step14Areas'
import Step15Blog from '../steps/Step15Blog'
import Step16Review from '../steps/Step12Review'

const STEPS = [
  { id: 'business', label: 'Business', num: '01', component: Step1Business },
  { id: 'customer', label: 'Customer', num: '02', component: Step2Customer },
  { id: 'visual', label: 'Direction', num: '03', component: Step3Visual },
  { id: 'moodboard', label: 'Moodboard', num: '04', component: Step4Moodboard },
  { id: 'references', label: 'References', num: '05', component: Step5References },
  { id: 'typography', label: 'Typography', num: '06', component: Step6Typography },
  { id: 'color', label: 'Color', num: '07', component: Step7Color },
  { id: 'homepage', label: 'Sections', num: '08', component: Step8Homepage },
  { id: 'designSystem', label: 'System', num: '09', component: Step9DesignSystem },
  { id: 'images', label: 'Images', num: '10', component: Step10Images },
  { id: 'animation', label: 'Motion', num: '11', component: Step11Animation },
  { id: 'mascot', label: 'Mascot', num: '12', component: Step12Mascot },
  { id: 'services', label: 'Services', num: '13', component: Step13Services },
  { id: 'areas', label: 'Areas', num: '14', component: Step14Areas },
  { id: 'blog', label: 'Blog', num: '15', component: Step15Blog },
  { id: 'review', label: 'Generate', num: '16', component: Step16Review },
]

export default function Wizard({ clientId, onBack }) {
  const [client, setClient] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAutofill, setShowAutofill] = useState(false)
  const saveTimer = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const data = getClient(clientId)
    if (data) {
      setClient(data)
      setCurrentStep(data.currentStep || 0)
    }
  }, [clientId])

  const debouncedSave = useCallback((updated) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveClient(updated)
    }, 500)
  }, [])

  const updateBrief = useCallback((section, data) => {
    setClient(prev => {
      const updated = {
        ...prev,
        brief: {
          ...prev.brief,
          [section]: typeof data === 'function' ? data(prev.brief[section]) : data,
        }
      }
      debouncedSave(updated)
      return updated
    })
  }, [debouncedSave])

  const goToStep = (step) => {
    setCurrentStep(step)
    setClient(prev => {
      const updated = { ...prev, currentStep: step }
      saveClient(updated)
      return updated
    })
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1)
  }

  const applyAutofill = (updatedBrief) => {
    setClient(prev => {
      const updated = { ...prev, brief: updatedBrief }
      saveClient(updated)
      return updated
    })
  }

  if (!client) return null

  const StepComponent = STEPS[currentStep].component

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-surface-4/50 bg-surface-0/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <span className="text-lg leading-none">&larr;</span>
              <span>Clients</span>
            </button>
            <div className="h-4 w-px bg-surface-4" />
            <h1 className="text-sm font-semibold text-zinc-200 truncate max-w-[200px]">
              {client.clientName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAutofill(true)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
              title="Auto-fill brief fields with OpenAI"
            >
              ✨ AI Autofill
            </button>
            <div className="text-xs text-zinc-600 font-mono">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
        </div>

        {/* Step navigation */}
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => goToStep(i)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                  whitespace-nowrap transition-all duration-200
                  ${i === currentStep
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : i < currentStep
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-3'
                      : 'text-zinc-600 hover:text-zinc-400 hover:bg-surface-3'
                  }
                `}
              >
                <span className="font-mono text-[10px] opacity-60">{step.num}</span>
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 step-enter" key={currentStep}>
          <StepComponent
            brief={client.brief}
            clientName={client.clientName}
            updateBrief={updateBrief}
          />
        </div>

        {/* Footer navigation */}
        <div className="border-t border-surface-4/50 bg-surface-0/80 backdrop-blur-sm sticky bottom-0">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer
                    ${i === currentStep ? 'w-6 bg-accent' : i < currentStep ? 'w-1.5 bg-accent/40' : 'w-1.5 bg-surface-4'}`}
                  onClick={() => goToStep(i)}
                />
              ))}
            </div>
            {currentStep < STEPS.length - 1 ? (
              <button onClick={nextStep} className="btn-primary">
                Next Step
              </button>
            ) : (
              <div className="w-[120px]" />
            )}
          </div>
        </div>
      </main>

      {showAutofill && (
        <AIAutofillModal
          brief={client.brief}
          onClose={() => setShowAutofill(false)}
          onApply={applyAutofill}
        />
      )}
    </div>
  )
}
