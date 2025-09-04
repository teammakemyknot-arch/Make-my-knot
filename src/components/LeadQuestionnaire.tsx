import { useState } from 'react'
import { saveLead, Lead } from '@/lib/leadStore'
import { Heart, ArrowRight, CheckCircle } from 'lucide-react'

interface Props {
  onSubmitted?: () => void
}

const steps = [
  { id: 'online_dating_experience', question: 'Have you tried online dating before?', type: 'choice', options: ['I’m new to it', 'Once or twice', 'I’m an online dating pro'] },
  { id: 'relationship_type', question: 'What kind of relationship are you looking for?', type: 'choice', options: ['Casual', 'Serious', 'Not sure, just browsing'] },
  { id: 'iam', question: 'I am', type: 'choice', options: ['a woman', 'a man', 'nonbinary'] },
  { id: 'looking_for', question: 'I am looking for', type: 'choice', options: ['a woman', 'a man', 'nonbinary', 'people'] },
  { id: 'location', question: 'Where do you live?', type: 'input', placeholder: 'City, State/Country' },
]

export default function LeadQuestionnaire({ onSubmitted }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)

  const current = steps[step]

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }))
    if (step < steps.length - 1) setStep(step + 1)
  }

  const handleNextFromInput = () => {
    if (!answers[current.id]) return
    setStep(step + 1)
  }

  const canSubmitContact = contact.name && contact.email && contact.phone

  const handleSubmitLead = () => {
    if (!canSubmitContact) return
    const lead: Lead = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      answers,
      status: 'new'
    }
    saveLead(lead)
    setSubmitted(true)
    onSubmitted?.()
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're in! 🎉</h3>
        <p className="text-gray-600 mb-6">Thanks {contact.name.split(' ')[0]}, we’ll reach out shortly with your curated matches.</p>
        <a href="/signup" className="btn-primary">Create your account</a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center mb-4">
        <Heart className="h-6 w-6 text-primary-600" />
        <span className="ml-2 text-sm font-semibold text-primary-600 uppercase">Get started free</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Answer a few quick questions</h3>

      {step < steps.length ? (
        <div>
          <p className="text-gray-800 font-medium mb-4">{current.question}</p>

          {current.type === 'choice' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {current.options?.map((opt) => (
                <button key={opt} onClick={() => handleSelect(opt)} className={`text-left p-4 border-2 rounded-lg hover:border-primary-600 transition-colors ${answers[current.id]===opt?'border-primary-600 bg-primary-50':''}`}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === 'input' && (
            <div className="flex gap-3">
              <input
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder={current.placeholder}
                value={answers[current.id]||''}
                onChange={(e)=>setAnswers(prev=>({...prev,[current.id]: e.target.value}))}
              />
              <button onClick={handleNextFromInput} className="btn-primary">Next <ArrowRight className="h-4 w-4 ml-2" /></button>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-3">Step {step+1} of {steps.length+1}</div>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 font-medium mb-4">Almost there! How can we reach you?</p>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Full name"
              value={contact.name}
              onChange={(e)=>setContact({...contact, name: e.target.value})}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Email"
              type="email"
              value={contact.email}
              onChange={(e)=>setContact({...contact, email: e.target.value})}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Phone"
              type="tel"
              value={contact.phone}
              onChange={(e)=>setContact({...contact, phone: e.target.value})}
            />
          </div>
          <button disabled={!canSubmitContact} onClick={handleSubmitLead} className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
            Submit
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          <div className="text-xs text-gray-500 mt-3">We’ll contact you with curated matches. No spam.</div>
          <div className="text-sm text-gray-500 mt-4">Step {steps.length+1} of {steps.length+1}</div>
        </div>
      )}
    </div>
  )
}

