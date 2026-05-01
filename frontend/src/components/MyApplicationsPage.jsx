const STATUS_MAP = {
  applied:     { label: 'Applied',      cls: 'csb-applied' },
  review:      { label: 'Under Review', cls: 'csb-review' },
  shortlisted: { label: 'Shortlisted',  cls: 'csb-shortlisted' },
  hired:       { label: 'Hired ',     cls: 'csb-hired' },
  rejected:    { label: 'Rejected',     cls: 'csb-rejected' },
}

export default function MyApplicationsPage({ applications }) {
  if (!applications.length) return (
    <div className="c-container">
      <div className="c-section-title">My Applications</div>
      <div className="c-section-sub">Track all your internship applications</div>
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          No applications yet
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-2)' }}>
          Browse internships and apply to start tracking here
        </div>
      </div>
    </div>
  )

  return (
    <div className="c-container">
      <div className="c-section-title">My Applications</div>
      <div className="c-section-sub">{applications.length} application{applications.length > 1 ? 's' : ''} submitted</div>

      <div className="c-track-table">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Type</th>
              <th>Stipend</th>
              <th>Applied On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => {
              const s = STATUS_MAP[app.status] || STATUS_MAP.applied
              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(124,58,237,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#a78bfa', fontFamily: 'Sora',
                        flexShrink: 0,
                      }}>
                        {app.companyName?.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{app.companyName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{app.applicantEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{app.internshipTitle}</td>
                  <td>
                    <span style={{
                      fontSize: 11.5, textTransform: 'capitalize',
                      padding: '3px 8px', borderRadius: 99,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                    }}>
                      {app.internshipType}
                    </span>
                  </td>
                  <td style={{ color: app.stipend === 'paid' ? '#34d399' : 'var(--text-2)', fontWeight: 600, fontFamily: 'Sora', fontSize: 13 }}>
                    {app.stipend === 'paid' ? `₹${app.salary?.toLocaleString()}/mo` : 'Unpaid'}
                  </td>
                  <td style={{ color: 'var(--text-3)', fontSize: 13 }}>
                    {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={`c-status-badge ${s.cls}`}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}