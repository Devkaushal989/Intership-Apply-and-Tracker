const TIPS = [
  "Pro tip: Customize each application to match the job description. Use specific keywords from the posting in your resume and cover letter.",
  "Pro tip: Follow up within 5-7 days after applying. A short email can set you apart from other candidates.",
  "Pro tip: Research the company before applying — knowing their mission helps you write a stronger cover letter.",
  "Pro tip: Keep your LinkedIn profile updated. Many recruiters check it before reviewing your resume.",
]

// Simple SVG Donut chart
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const size = 140
  const cx = size / 2
  const cy = size / 2
  const r  = 52
  const strokeW = 22

  let cumulative = 0
  const circ = 2 * Math.PI * r

  const segments = data.map((d, i) => {
    const pct  = d.value / total
    const dash = pct * circ
    const gap  = circ - dash
    const offset = circ - cumulative * circ
    cumulative += pct
    return { ...d, dash, gap, offset }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW}/>
      {segments.map((seg, i) => (
        seg.value > 0 && (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 0.6s ease' }}
          />
        )
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#f1f5f9" fontSize="22" fontWeight="800" fontFamily="Sora, sans-serif">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="DM Sans, sans-serif">Total</text>
    </svg>
  )
}

// Simple bar chart
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div className="bar-wrap" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="bar-val">{d.value}</div>
          <div
            className="bar"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: i === data.reduce((mi, v, vi) => v.value > data[mi].value ? vi : mi, 0)
                ? 'linear-gradient(180deg, #7c3aed, #4f46e5)'
                : 'rgba(124,58,237,0.5)',
              animationDelay: `${i * 0.1}s`,
            }}
          />
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function TrackingPage({ applications }) {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)]

  const stats = {
    total:       applications.length,
    applied:     applications.filter(a => a.status === 'applied').length,
    inProgress:  applications.filter(a => ['review', 'shortlisted'].includes(a.status)).length,
    accepted:    applications.filter(a => a.status === 'hired').length,
    rejected:    applications.filter(a => a.status === 'rejected').length,
  }

  // Weekly data — last 4 weeks (mock split)
  const weeklyData = [
    { label: 'Week 1', value: Math.max(1, Math.floor(applications.length * 0.2)) },
    { label: 'Week 2', value: Math.max(1, Math.floor(applications.length * 0.35)) },
    { label: 'Week 3', value: Math.max(1, Math.floor(applications.length * 0.28)) },
    { label: 'Week 4', value: Math.max(0, applications.length - Math.floor(applications.length * 0.83)) },
  ]

  const donutData = [
    { label: 'Applied',     value: stats.applied,    color: '#7c3aed' },
    { label: 'In Review',   value: stats.inProgress, color: '#06b6d4' },
    { label: 'Accepted',    value: stats.accepted,   color: '#10b981' },
    { label: 'Rejected',    value: stats.rejected,   color: '#ef4444' },
    { label: 'Yet to apply',value: Math.max(0, 10 - applications.length), color: '#334155' },
  ]

  const statCards = [
    { label: 'Total Applications', value: stats.total,      cls: 'si-purple', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label: 'Applied',            value: stats.applied,    cls: 'si-cyan',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
    { label: 'In Progress',        value: stats.inProgress, cls: 'si-yellow',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Accepted',           value: stats.accepted,   cls: 'si-green',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  ]

  return (
    <div className="c-container">
      <div className="c-section-title">Tracking</div>
      <div className="c-section-sub">Your internship application progress at a glance</div>

      {/* Stats */}
      <div className="c-stats-grid">
        {statCards.map((s, i) => (
          <div className="c-stat-card" key={i}>
            <div>
              <div className="c-stat-val">{s.value}</div>
              <div className="c-stat-label">{s.label}</div>
            </div>
            <div className={`c-stat-icon ${s.cls}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="c-charts-row">
        {/* Bar chart */}
        <div className="c-card">
          <div className="c-card-title">Weekly Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#7c3aed' }}/>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Applications Submitted</span>
          </div>
          <BarChart data={weeklyData} />
        </div>

       
        <div className="c-card">
          <div className="c-card-title">Application Status Breakdown</div>
          <div className="donut-wrap">
            <DonutChart data={donutData} />
            <div className="donut-legend">
              {donutData.map((d, i) => (
                <div className="legend-item" key={i}>
                  <div className="legend-dot" style={{ background: d.color }}/>
                  <span>{d.label}</span>
                  <span style={{ marginLeft: 4, fontWeight: 600, color: 'var(--text)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      <div style={{ marginBottom: 24 }}>
        <div className="c-card-title" style={{ marginBottom: 12 }}>Upcoming Deadlines</div>
        <div className="c-alert">
          <div className="c-alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="c-alert-title">Attention Needed</div>
            <div className="c-alert-desc">
              {applications.length > 0
                ? `${Math.min(3, applications.length)} application${applications.length > 1 ? 's' : ''} have deadlines this week. Don't miss out!`
                : 'No active applications yet. Browse internships and start applying!'}
            </div>
          </div>
        </div>
      </div>

      
      <div className="c-banner">
        <div className="c-banner-title">Keep Going! 💪</div>
        <div className="c-banner-desc">{tip}</div>
      </div>
    </div>
  )
}