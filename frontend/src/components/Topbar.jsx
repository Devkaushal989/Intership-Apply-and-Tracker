export default function Topbar({ title, initials, searchQuery, onSearch, onLogout, isAdmin }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder={isAdmin ? 'Search internships, companies...' : 'Search internships...'}
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        {/* Admin badge */}
        {isAdmin && (
          <div style={{
            padding: '5px 12px', borderRadius: 8,
            background: '#111', color: '#fff',
            fontSize: 12, fontWeight: 700,
            letterSpacing: '0.5px',
          }}>
            ADMIN
          </div>
        )}

        {/* Avatar */}
        <div className="avatar-btn">{initials}</div>

        {/* Logout — visible in topbar too */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#dc2626',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        )}
      </div>
    </header>
  )
}