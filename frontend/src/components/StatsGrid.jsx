export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Total Listings',  value: stats.total,      change: '+2 this week', up: true,  cls: 'indigo', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
    { label: 'Active Listings', value: stats.active,     change: 'Currently live', up: true, cls: 'cyan',  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'Total Applicants',value: stats.applicants, change: '+8 this week', up: true,  cls: 'green', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Hired',           value: stats.hired,      change: 'This cycle',   up: true,  cls: 'amber', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  ]
  return (
    <div className="stats-grid">
      {items.map((s, i) => (
        <div className="stat-card" key={i}>
          <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>{s.change}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
