export default function HomePage({ user, applications, onNav }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  const recent = applications.slice(0, 3)

  const STATUS_MAP = {
    applied:     { label: 'Applied',      color: '#a78bfa' },
    review:      { label: 'Under Review', color: '#67e8f9' },
    shortlisted: { label: 'Shortlisted',  color: '#fbbf24' },
    hired:       { label: 'Hired 🎉',     color: '#34d399' },
    rejected:    { label: 'Rejected',     color: '#f87171' },
  }

  return (
    <div className="c-container">
      {/* Hero greeting */}
      <div style={{
        background: 'linear-gradient(135deg, #1e0a3c 0%, #2d1467 50%, #0f172a 100%)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 16, padding: '36px 36px',
        marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{ fontFamily: 'Sora', fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>
          {greeting} 
        </div>
        <div style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Welcome back, {firstName}!
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 24, maxWidth: 500 }}>
          Your internship journey is in full swing. Keep applying and tracking your progress.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="c-apply-btn" onClick={() => onNav('internships')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            Browse Internships
          </button>
          <button
            onClick={() => onNav('tracking')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'DM Sans', transition: 'all 0.15s',
            }}
          >
            View Tracking
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Applications Sent',   value: applications.length,                                    color: '#7c3aed' },
          { label: 'In Progress',         value: applications.filter(a => ['review','shortlisted'].includes(a.status)).length, color: '#06b6d4' },
          { label: 'Accepted',            value: applications.filter(a => a.status === 'hired').length,  color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="c-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNav('tracking')}>
            <div>
              <div className="c-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="c-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            Recent Applications
          </div>
          {applications.length > 3 && (
            <button
              onClick={() => onNav('applications')}
              style={{ fontSize: 13, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}
            >
              View all →
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🚀</div>
            <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              No applications yet
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Start browsing and apply to internships</div>
            <button className="c-apply-btn" style={{ margin: '0 auto' }} onClick={() => onNav('internships')}>
              Browse Internships
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((app, i) => {
              const s = STATUS_MAP[app.status] || STATUS_MAP.applied
              return (
                <div key={i} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'rgba(124,58,237,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Sora', fontWeight: 700, fontSize: 12, color: '#a78bfa',
                    flexShrink: 0,
                  }}>
                    {app.companyName?.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{app.internshipTitle}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{app.companyName}</div>
                  </div>
                  <div style={{
                    fontSize: 11.5, fontWeight: 600, padding: '4px 10px',
                    borderRadius: 99, color: s.color,
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                  }}>
                    {s.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Motivational tip */}
      <div className="c-banner">
        <div className="c-banner-title">💡 Today's Tip</div>
        <div className="c-banner-desc">
          Apply to at least 2-3 internships per week. Consistency is the key to landing your dream internship. Track your progress in the Tracking tab.
        </div>
      </div>
    </div>
  )
}