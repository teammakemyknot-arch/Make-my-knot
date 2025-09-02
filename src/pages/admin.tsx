import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Shield, Trash2, CheckCircle2, Mail, Phone, User as UserIcon, Lock, LogIn } from 'lucide-react'
import { getLeads, deleteLead, verifyLead, Lead } from '@/lib/leadStore'

// Simple admin auth using a sessionStorage token (demo only)
const ADMIN_TOKEN_KEY = 'makemyknot_admin_token'
const ADMIN_PASSWORD = 'admin123' // demo only; replace with secure backend in production

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (token === 'ok') {
      setAuthed(true)
      setLeads(getLeads())
    }
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, 'ok')
      setAuthed(true)
      setLeads(getLeads())
    } else {
      alert('Invalid admin password')
    }
  }

  const refresh = () => setLeads(getLeads())

  const handleDelete = (id: string) => {
    if (confirm('Delete this lead?')) {
      deleteLead(id)
      refresh()
    }
  }

  const handleVerify = (id: string) => {
    verifyLead(id)
    refresh()
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-gray-800" />
            <h1 className="ml-2 text-xl font-semibold">Admin Login</h1>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <div className="flex">
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent" placeholder="Enter admin password" />
                <button type="submit" className="px-4 bg-primary-600 text-white rounded-r-lg flex items-center"><LogIn className="h-4 w-4 mr-1"/>Login</button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Demo password: admin123 (Replace with secure auth in production)</p>
          </form>
        </div>
      </main>
    )
  }

  const filteredLeads = leads.filter(l => filter==='all' ? true : l.status === filter)

  return (
    <>
      <Head>
        <title>Admin Dashboard - Make My Knot</title>
      </Head>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-gray-800" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-600">Leads: {leads.length}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Lead Inbox</h2>
              <div className="flex items-center gap-2">
                <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="verified">Verified</option>
                </select>
                <button onClick={refresh} className="text-sm px-3 py-2 border rounded-lg">Refresh</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Contact</th>
                    <th className="py-2 pr-4">Answers</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-gray-900 flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-500"/>
                        {lead.name}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400"/>{lead.email}</div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400"/>{lead.phone}</div>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 max-w-md">
                        <div className="space-y-1">
                          {Object.entries(lead.answers).map(([k,v]) => (
                            <div key={k}><span className="font-medium text-gray-700">{k}:</span> {Array.isArray(v)? v.join(', '): String(v)}</div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded text-xs ${lead.status==='verified'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-800'}`}>{lead.status}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {lead.status !== 'verified' && (
                            <button onClick={()=>handleVerify(lead.id)} className="px-3 py-1 rounded bg-green-600 text-white text-xs flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/>Verify</button>
                          )}
                          <button onClick={()=>handleDelete(lead.id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs flex items-center gap-1"><Trash2 className="h-4 w-4"/>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Section (read-only from localStorage) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
            <UsersList />
          </div>
        </div>
      </main>
    </>
  )
}

function UsersList() {
  const [users, setUsers] = useState<any[]>([])
  useEffect(()=>{
    try {
      const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
      // hide passwords
      const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
      setUsers(sanitized)
    } catch { setUsers([]) }
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Phone</th>
            <th className="py-2 pr-4">Verified</th>
            <th className="py-2 pr-4">Subscription</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u)=> (
            <tr key={u.id} className="border-b last:border-0">
              <td className="py-3 pr-4">{u.name || '—'}</td>
              <td className="py-3 pr-4">{u.email}</td>
              <td className="py-3 pr-4">{u.phone || '—'}</td>
              <td className="py-3 pr-4">{u.isVerified ? 'Yes' : 'No'}</td>
              <td className="py-3 pr-4">{u.subscription?.plan || '—'}</td>
              <td className="py-3 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {users.length===0 && (
            <tr><td colSpan={6} className="py-6 text-center text-gray-500">No users yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

