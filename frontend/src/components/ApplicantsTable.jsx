import { useState } from 'react'

const STATUS_CONFIG = {
  applied:     { label: 'Applied',      cls: 'badge-draft'   },
  review:      { label: 'Under Review', cls: 'badge-paused'  },
  shortlisted: { label: 'Shortlisted',  cls: 'badge-paused'  },
  hired:       { label: 'Hired',        cls: 'badge-active'  },
  rejected:    { label: 'Rejected',     cls: 'badge-closed'  },
}

const AV_COLORS = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']

export default function ApplicantsTable({ applicants = [], readOnly = false, token, onStatusUpdate }) {
  const [filter,      setFilter]      = useState('all')
  const [statuses,    setStatuses]    = useState(
    Object.fromEntries(applicants.map(a => [a._id || a.id, a.status]))
  )
  const [showResume,  setShowResume]  = useState(null)
  const [updating,    setUpdating]    = useState(null)

  const filtered = filter === 'all'
    ? applicants
    : applicants.filter(a => (statuses[a._id || a.id] || a.status) === filter)

  const updateStatus = async (id, status) => {
    if (readOnly || !token) return
    setUpdating(id)
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status }),
      })
      if (res.ok) {
        setStatuses(prev => ({ ...prev, [id]: status }))
        if (onStatusUpdate) onStatusUpdate(id, status)
      }
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setUpdating(null)
    }
  }

  const tabs = [
    { id: 'all',         label: 'All',          count: applicants.length },
    { id: 'applied',     label: 'Applied',       count: applicants.filter(a => (statuses[a._id||a.id]||a.status) === 'applied').length },
    { id: 'review',      label: 'Under Review',  count: applicants.filter(a => (statuses[a._id||a.id]||a.status) === 'review').length },
    { id: 'shortlisted', label: 'Shortlisted',   count: applicants.filter(a => (statuses[a._id||a.id]||a.status) === 'shortlisted').length },
    { id: 'hired',       label: 'Hired',         count: applicants.filter(a => (statuses[a._id||a.id]||a.status) === 'hired').length },
    { id: 'rejected',    label: 'Rejected',       count: applicants.filter(a => (statuses[a._id||a.id]||a.status) === 'rejected').length },
  ]

  if (!applicants.length) return (
    <div className="table-wrap">
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
        </div>
        <div className="empty-title">No applicants yet</div>
        <div className="empty-desc">Applications will appear here once candidates apply</div>
      </div>
    </div>
  )

  return (
    <>
      <div className="table-wrap">
        {/* Filter Tabs */}
        <div className="table-filters">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`filter-tab ${filter === t.id ? 'active' : ''}`}
              onClick={() => setFilter(t.id)}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No applicants in this category</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Applied For</th>
                <th>Applied Date</th>
                <th>Resume</th>
                <th>Status</th>
                {!readOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const id  = a._id || a.id
                const st  = statuses[id] || a.status || 'applied'
                const cfg = STATUS_CONFIG[st] || STATUS_CONFIG.applied
                const col = AV_COLORS[i % AV_COLORS.length]
                const nameInitials = (a.applicantName || a.name || '?')
                  .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

                return (
                  <tr key={id}>
                    <td>
                      <div className="applicant-name-cell">
                        <div className="applicant-av" style={{ background: col }}>
                          {nameInitials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{a.applicantName || a.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.applicantEmail || a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>
                      {a.internshipTitle || a.role}
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>
                      {a.appliedAt
                        ? new Date(a.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : a.date || '—'
                      }
                    </td>
                    <td>
                      {(a.resumeName || a.resume) ? (
                        <button className="resume-btn" onClick={() => setShowResume(a)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          View Resume
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Not uploaded</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    {!readOnly && (
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={st === 'shortlisted' || st === 'hired' || updating === id}
                            onClick={() => updateStatus(id, 'shortlisted')}
                          >
                            Shortlist
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={st === 'hired' || updating === id}
                            onClick={() => updateStatus(id, 'hired')}
                          >
                            Hire
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={st === 'rejected' || updating === id}
                            onClick={() => updateStatus(id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Resume Modal */}
      {showResume && (
        <div className="modal-overlay" onClick={() => setShowResume(null)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Resume — {showResume.applicantName || showResume.name}</div>
              <button className="modal-close" onClick={() => setShowResume(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{
                background: 'var(--bg)', borderRadius: 12,
                padding: 32, textAlign: 'center',
                border: '2px dashed var(--border)',
                color: 'var(--text-2)',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ margin: '0 auto 12px', display: 'block', color: 'var(--primary)' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  {showResume.resumeName || showResume.resume || 'resume.pdf'}
                </div>
                <div style={{ fontSize: 13, marginBottom: 16 }}>
                  Applied for: {showResume.internshipTitle || showResume.role}
                </div>
                <button className="btn btn-primary" style={{ margin: '0 auto' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}