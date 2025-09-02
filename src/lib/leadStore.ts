export interface Lead {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  email: string
  phone: string
  answers: Record<string, any>
  status: 'new' | 'verified' | 'deleted'
}

const LEADS_KEY = 'makemyknot_leads'

export function getLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveLead(lead: Lead) {
  const leads = getLeads()
  const existingIndex = leads.findIndex(l => l.id === lead.id)
  if (existingIndex >= 0) {
    leads[existingIndex] = lead
  } else {
    leads.push(lead)
  }
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function deleteLead(id: string) {
  const leads = getLeads().filter(l => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function verifyLead(id: string) {
  const leads = getLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) {
    leads[idx].status = 'verified'
    leads[idx].updatedAt = new Date().toISOString()
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  }
}

