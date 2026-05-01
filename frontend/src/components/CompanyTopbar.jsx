export default function CompanyTopbar({ title, initials, companyName, searchQuery, onSearch, onLogout }) {
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
            placeholder="Search internships..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        {/* Company name pill */}
        <div style={{
          padding: '6px 12px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          maxWidth: 160,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {companyName}
        </div>

        {/* Avatar */}
        <div className="avatar-btn">{initials}</div>

        {/* Logout — RED button */}
        <button
          onClick={onLogout}
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           6,
            padding:       '8px 14px',
            background:    '#ef4444',
            color:         '#fff',
            border:        'none',
            borderRadius:  10,
            fontSize:      13.5,
            fontWeight:    600,
            cursor:        'pointer',
            fontFamily:    'inherit',
            transition:    'background 0.15s',
            whiteSpace:    'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  )
}