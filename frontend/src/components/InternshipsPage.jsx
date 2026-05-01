import { useState, useEffect } from 'react'

const API = 'http://localhost:5000'

function ApplyModal({ internship, onClose, onApply }) {
  const [form, setForm]       = useState({ name: '', email: '', coverLetter: '' })
  const [resume, setResume]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!resume)            e.resume = 'Please upload your resume'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await onApply({ ...form, resumeName: resume?.name })
    setLoading(false)
  }

  return (
    <div className="c-modal-overlay" onClick={onClose}>
      <div className="c-modal" onClick={e => e.stopPropagation()}>
        <div className="c-modal-header">
          <div className="c-modal-title">Apply — {internship.title}</div>
          <button className="c-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="c-modal-body">

          {/* Internship mini summary */}
          <div style={{
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', gap: 12, alignItems: 'center'
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Sora', fontWeight: 700, fontSize: 12, color: '#a78bfa' }}>
              {internship.companyName?.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{internship.companyName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{internship.role} · {internship.type}</div>
            </div>
            {internship.stipend === 'paid' && (
              <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: '#34d399', fontFamily: 'Sora' }}>
                ₹{internship.salary?.toLocaleString()}/mo
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="c-form-group">
              <label className="c-form-label">Full Name *</label>
              <input className="c-form-input" placeholder="Your full name" value={form.name} onChange={set('name')} />
              {errors.name && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.name}</span>}
            </div>

            <div className="c-form-group">
              <label className="c-form-label">Email Address *</label>
              <input className="c-form-input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
              {errors.email && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.email}</span>}
            </div>

            <div className="c-form-group">
              <label className="c-form-label">Cover Letter (optional)</label>
              <textarea
                className="c-form-textarea"
                rows={4}
                placeholder="Tell the company why you're a great fit for this role..."
                value={form.coverLetter}
                onChange={set('coverLetter')}
              />
            </div>

            {/* Resume Upload */}
            <div className="c-form-group">
              <label className="c-form-label">Resume / CV *</label>
              <label className={`c-upload-box ${resume ? 'has-file' : ''}`}>
                <input
                  type="file" accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => { setResume(e.target.files[0]); setErrors(p => ({ ...p, resume: '' })) }}
                />
                {resume ? (
                  <>
                    <div className="c-upload-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="c-upload-filename">{resume.name}</div>
                    <div className="c-upload-hint">Click to change file</div>
                  </>
                ) : (
                  <>
                    <div className="c-upload-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div className="c-upload-text">Click to upload your resume</div>
                    <div className="c-upload-hint">PDF, DOC, DOCX accepted</div>
                  </>
                )}
              </label>
              {errors.resume && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.resume}</span>}
            </div>

            <div className="c-modal-footer">
              <button type="button" className="c-btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="c-btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function InternshipsPage({ applications, onApply }) {
  const [internships, setInternships] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('all')
  const [stipendFilter, setStipendFilter] = useState('all')
  const [applyTarget, setApplyTarget] = useState(null)

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/internships/public`)
      const data = await res.json()
      setInternships(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching internships:', err)
      setInternships([])
    } finally {
      setLoading(false)
    }
  }

  const hasApplied = (id) => applications.some(a => a.internshipId === id)

  const filtered = internships.filter(i => {
    const ms = !search || i.title.toLowerCase().includes(search.toLowerCase()) ||
               i.companyName?.toLowerCase().includes(search.toLowerCase()) ||
               i.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const mt = typeFilter   === 'all' || i.type    === typeFilter
    const mp = stipendFilter === 'all' || i.stipend === stipendFilter
    return ms && mt && mp
  })

  const handleApply = async (formData) => {
    await onApply(applyTarget, formData)
    setApplyTarget(null)
  }

  return (
    <div className="c-container">
      <div className="c-section-title">Browse Internships</div>
      <div className="c-section-sub">{filtered.length} internships available — find your perfect match</div>

      {/* Filters */}
      <div className="c-filters">
        <div className="c-search-wrap">
          <span className="c-search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="c-filter-input"
            placeholder="Search by title, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="c-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select className="c-select" value={stipendFilter} onChange={e => setStipendFilter(e.target.value)}>
          <option value="all">All Stipends</option>
          <option value="paid">Paid Only</option>
          <option value="unpaid">Unpaid / Certificate</option>
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>
          Loading internships...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No internships found</div>
          <div style={{ fontSize: 13.5 }}>Try different search terms or filters</div>
        </div>
      ) : (
        <div className="c-intern-grid">
          {filtered.map((item, idx) => (
            <div className="c-intern-card" key={item._id} style={{ animationDelay: `${idx * 0.04}s` }}>
              <div className="cic-top">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="cic-logo">{item.companyName?.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{item.companyName}</div>
                    <div className="cic-company">{item.role}</div>
                  </div>
                </div>
                {hasApplied(item._id) && (
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99,
                    background: 'rgba(16,185,129,0.12)', color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>
                    ✓ Applied
                  </span>
                )}
              </div>

              <div className="cic-title">{item.title}</div>

              <div className="c-tags">
                <span className={`c-tag ${item.stipend === 'paid' ? 'ct-paid' : 'ct-unpaid'}`}>
                  {item.stipend === 'paid' ? `₹${item.salary?.toLocaleString()}/mo` : 'Unpaid'}
                </span>
                <span className={`c-tag ct-${item.type}`} style={{ textTransform: 'capitalize' }}>
                  {item.type}
                </span>
                {item.skills?.slice(0, 2).map(s => (
                  <span key={s} className="c-tag ct-skill">{s}</span>
                ))}
                {item.skills?.length > 2 && (
                  <span className="c-tag ct-skill">+{item.skills.length - 2}</span>
                )}
              </div>

              <div className="cic-meta">
                <span className="cic-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {item.duration}
                </span>
                <span className="cic-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {item.openings} opening{item.openings > 1 ? 's' : ''}
                </span>
              </div>

              <p className="cic-desc">{item.description}</p>

              <div className="cic-footer">
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <button
                  className={`c-apply-btn ${hasApplied(item._id) ? 'applied' : ''}`}
                  disabled={hasApplied(item._id)}
                  onClick={() => !hasApplied(item._id) && setApplyTarget(item)}
                >
                  {hasApplied(item._id) ? (
                    <>✓ Applied</>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Apply Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {applyTarget && (
        <ApplyModal
          internship={applyTarget}
          onClose={() => setApplyTarget(null)}
          onApply={handleApply}
        />
      )}
    </div>
  )
}