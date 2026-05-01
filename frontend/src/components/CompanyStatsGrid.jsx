export default function CompanyStatsGrid({ stats }) {
  const items = [
    {
      label: 'Total Listings', value: stats.total, sub: 'All time',
      cls: 'indigo',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    },
    {
      label: 'Active', value: stats.active, sub: 'Currently live',
      cls: 'cyan',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    },
    {
      label: 'Drafts', value: stats.draft, sub: 'Not published',
      cls: 'amber',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    },
    {
      label: 'Paused', value: stats.paused, sub: 'Temporarily off',
      cls: 'green',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>,
    },
  ]

  return (
    <div className="stats-grid">
      {items.map((s, i) => (
        <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-change up">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}