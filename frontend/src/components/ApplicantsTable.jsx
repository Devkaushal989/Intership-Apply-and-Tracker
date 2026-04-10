import { useState } from 'react'

const STATUS_CONFIG = {
  review:      { label: 'Under Review', cls: 'badge-draft'   },
  shortlisted: { label: 'Shortlisted',  cls: 'badge-paused'  },
  hired:       { label: 'Hired',        cls: 'badge-active'  },
  rejected:    { label: 'Rejected',     cls: 'badge-closed'  },
}

export default function ApplicantsTable({ applicants }) {
  const [filter, setFilter]         = useState('all')
  const [statuses, setStatuses]     = useState(
    Object.fromEntries(applicants.map(a => [a.id, a.status]))
  )
  const [showResume, setShowResume] = useState(null)

  const filtered = filter === 'all'
    ? applicants
    : applicants.filter(a => statuses[a.id] === filter)

  const updateStatus = (id, status) => {
    setStatuses(prev => ({ ...prev, [id]: status }))
  }

  const tabs = [
    { id: 'all',         label: 'All',         count: applicants.length },
    { id: 'review',      label: 'Under Review', count: applicants.filter(a => statuses[a.id] === 'review').length },
    { id: 'shortlisted', label: 'Shortlisted',  count: applicants.filter(a => statuses[a.id] === 'shortlisted').length },
    { id: 'hired',       label: 'Hired',        count: applicants.filter(a => statuses[a.id] === 'hired').length },
    { id: 'rejected',    label: 'Rejected',     count: applicants.filter(a => statuses[a.id] === 'rejected').length },
  ]

  return (
    <>
      <div className="table-wrap">
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
            <div className="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const st = statuses[a.id]
                const cfg = STATUS_CONFIG[st] || STATUS_CONFIG.review
                return (
                  <tr key={a.id}>
                    <td>
                      <div className="applicant-name-cell">
                        <div className="applicant-av" style={{ background: a.color }}>
                          {a.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{a.role}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{a.date}</td>
                    <td>
                      <button className="resume-btn" onClick={() => setShowResume(a)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        View Resume
                      </button>
                    </td>
                    <td>
                      <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateStatus(a.id, 'shortlisted')}
                          disabled={st === 'shortlisted' || st === 'hired'}
                        >
                          Shortlist
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => updateStatus(a.id, 'hired')}
                          disabled={st === 'hired'}
                        >
                          Hire
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(a.id, 'rejected')}
                          disabled={st === 'rejected'}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Resume Preview Modal */}
      {showResume && (
        <div className="modal-overlay" onClick={() => setShowResume(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Resume — {showResume.name}</div>
              <button className="modal-close" onClick={() => setShowResume(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{
                background: 'var(--bg)', borderRadius: 12,
                padding: 32, textAlign: 'center', border: '2px dashed var(--border)',
                color: 'var(--text-2)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block', color: 'var(--primary)' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{showResume.name}_Resume.pdf</div>
                <div style={{ fontSize: 13, marginBottom: 16 }}>Applied for: {showResume.role}</div>
                <button className="btn btn-primary" style={{ margin: '0 auto' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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