import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Dashboard.css'

const API = 'http://localhost:5000'
const ADMIN_EMAIL = 'admin@internbuddy.com'

// ─────────────────────────────────────────────
//  Mini Components
// ─────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#111"/>
    <path d="M10 22l5-5 4 4 7-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="12" r="2.5" fill="#fff"/>
  </svg>
)

function StatCard({ icon, label, value, sub, color = '#4f46e5', bg = '#ede9fe' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-change up">{sub}</div>}
      </div>
    </div>
  )
}

function Badge({ status }) {
  const map = {
    active:      { cls: 'badge-active',  label: 'Active'      },
    draft:       { cls: 'badge-draft',   label: 'Draft'       },
    closed:      { cls: 'badge-closed',  label: 'Closed'      },
    paused:      { cls: 'badge-paused',  label: 'Paused'      },
    applied:     { cls: 'badge-draft',   label: 'Applied'     },
    review:      { cls: 'badge-paused',  label: 'Reviewing'   },
    shortlisted: { cls: 'badge-paused',  label: 'Shortlisted' },
    hired:       { cls: 'badge-active',  label: 'Hired'       },
    rejected:    { cls: 'badge-closed',  label: 'Rejected'    },
  }
  const s = map[status] || map.draft
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>
}

const AV = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6']

function Avatar({ name = '?', i = 0, size = 34 }) {
  const letters = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 3,
      background: AV[i % AV.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sora', fontWeight: 700,
      fontSize: size * 0.35, color: '#fff', flexShrink: 0,
    }}>
      {letters}
    </div>
  )
}

// ─────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',         icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: 'organizations', label: 'Organizations',    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'candidates',    label: 'Candidates',       icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'internships',   label: 'All Internships',  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { id: 'applications',  label: 'All Applications', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
]

function AdminSidebar({ active, onNav, user, onLogout }) {
  const initials = (user?.name || 'SA').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LogoIcon />
        <span className="sidebar-logo-text">InternBuddy</span>
      </div>

      <div className="sidebar-section-label">Admin Panel</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="org-card">
          <div className="org-avatar">{initials}</div>
          <div>
            <div className="org-name">{user?.name || 'Super Admin'}</div>
            <div className="org-role">Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', marginTop: 8,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#dc2626', fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
//  TOPBAR
// ─────────────────────────────────────────────
function AdminTopbar({ title, search, onSearch, onLogout, user }) {
  const initials = (user?.name || 'SA').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <div className="topbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search anything..." value={search} onChange={e => onSearch(e.target.value)}/>
        </div>
        <div style={{
          padding: '4px 10px', background: '#111', color: '#fff',
          borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px',
        }}>ADMIN</div>
        <div className="avatar-btn">{initials}</div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: '#fef2f2', border: '1.5px solid #fecaca',
            color: '#dc2626', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
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
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────
//  OVERVIEW PAGE
// ─────────────────────────────────────────────
function OverviewPage({ internships, applicants, companies, candidates }) {
  const stats = [
    { label: 'Total Organizations', value: companies.length,                                   sub: 'Registered companies',          color: '#4f46e5', bg: '#ede9fe', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: 'Total Candidates',    value: candidates.length,                                  sub: 'Registered students',           color: '#06b6d4', bg: '#cffafe', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label: 'Total Internships',   value: internships.length,                                 sub: `${internships.filter(i=>i.status==='active').length} active`,  color: '#10b981', bg: '#d1fae5', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
    { label: 'Total Applications',  value: applicants.length,                                  sub: `${applicants.filter(a=>a.status==='hired').length} hired`,      color: '#f59e0b', bg: '#fef3c7', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ]

  // Application funnel
  const funnel = [
    { label: 'Applied',     count: applicants.filter(a=>a.status==='applied').length,     color: '#4f46e5' },
    { label: 'Reviewing',   count: applicants.filter(a=>a.status==='review').length,      color: '#06b6d4' },
    { label: 'Shortlisted', count: applicants.filter(a=>a.status==='shortlisted').length, color: '#f59e0b' },
    { label: 'Hired',       count: applicants.filter(a=>a.status==='hired').length,       color: '#10b981' },
    { label: 'Rejected',    count: applicants.filter(a=>a.status==='rejected').length,    color: '#ef4444' },
  ]
  const maxFunnel = Math.max(...funnel.map(f => f.count), 1)

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1e1b4b 100%)',
        borderRadius: 14, padding: '24px 28px', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
            Admin Control Panel 🛡️
          </div>
          <div style={{ fontSize: 13.5, opacity: 0.65 }}>
            Full visibility across all organizations, candidates, internships and applications.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Sora' }}>{applicants.filter(a=>a.status==='applied').length}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Pending Reviews</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Application Funnel + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Funnel */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Application Pipeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {funnel.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.count}</span>
                </div>
                <div style={{ height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${(f.count / maxFunnel) * 100}%`,
                    background: f.color, transition: 'width 0.8s ease',
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies by internships */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Top Companies by Internships</div>
          {companies.length === 0 ? (
            <div style={{ color: 'var(--text-2)', fontSize: 13 }}>No companies yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {companies.slice(0, 5).map((c, i) => {
                const count = internships.filter(int => int.companyName === c.name).length
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={c.name} i={i} size={32}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.industry || 'N/A'}</div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 99, background: '#ede9fe', color: '#4f46e5',
                    }}>{count} listings</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Recent Applications */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="section-title">Recent Applications</div>
        </div>
        {applicants.length === 0 ? (
          <div className="empty-state"><div className="empty-title">No applications yet</div></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Candidate','Applied For','Company','Date','Status'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', textAlign: 'left', background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applicants.slice(0, 8).map((a, i) => (
                <tr key={a._id || i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={a.applicantName || '?'} i={i} size={28}/>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.applicantName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{a.applicantEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{a.internshipTitle}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{a.companyName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-2)' }}>
                    {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}><Badge status={a.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  ORGANIZATIONS PAGE
// ─────────────────────────────────────────────
function OrganizationsPage({ companies, internships, applicants, search }) {
  const filtered = companies.filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">All Organizations</div>
          <div className="section-sub">{filtered.length} companies registered on InternBuddy</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="table-wrap"><div className="empty-state"><div className="empty-title">No organizations found</div></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((c, i) => {
            const posted    = internships.filter(int => int.companyName === c.name).length
            const active    = internships.filter(int => int.companyName === c.name && int.status === 'active').length
            const totalApps = applicants.filter(a => a.companyName === c.name).length
            const hired     = applicants.filter(a => a.companyName === c.name && a.status === 'hired').length

            return (
              <div key={c._id || i} className="intern-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <Avatar name={c.name} i={i} size={44}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2 }}>{c.email}</div>
                    {c.industry && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{c.industry}</div>}
                  </div>
                  {c.website && (
                    <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                       target="_blank" rel="noreferrer"
                       style={{ color: 'var(--primary)', fontSize: 12 }}>
                      🔗 Website
                    </a>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'Posted',   value: posted,    color: '#4f46e5' },
                    { label: 'Active',   value: active,    color: '#10b981' },
                    { label: 'Applicants', value: totalApps, color: '#06b6d4' },
                    { label: 'Hired',    value: hired,     color: '#f59e0b' },
                  ].map((s, si) => (
                    <div key={si} style={{ textAlign: 'center', background: 'var(--bg)', borderRadius: 8, padding: '8px 4px' }}>
                      <div style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-2)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  Registered: {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CandidatesPage({ candidates, applicants, search }) {
  const filtered = candidates.filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">All Candidates</div>
          <div className="section-sub">{filtered.length} students registered on InternBuddy</div>
        </div>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-title">No candidates found</div></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Candidate','Email','Applications','Shortlisted','Hired','Rejected','Registered'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', textAlign: 'left', background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const myApps = applicants.filter(a => a.applicantEmail === c.email)
                return (
                  <tr key={c._id || i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={c.name} i={i} size={32}/>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{c.email}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#4f46e5' }}>{myApps.length}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#f59e0b' }}>{myApps.filter(a=>a.status==='shortlisted').length}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#10b981' }}>{myApps.filter(a=>a.status==='hired').length}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#ef4444' }}>{myApps.filter(a=>a.status==='rejected').length}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-2)' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  ALL INTERNSHIPS PAGE
// ─────────────────────────────────────────────
function AllInternshipsPage({ internships, search }) {
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = internships.filter(i => {
    const ms = !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.companyName?.toLowerCase().includes(search.toLowerCase())
    const mf = statusFilter === 'all' || i.status === statusFilter
    return ms && mf
  })

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="section-title">All Internships</div>
          <div className="section-sub">{filtered.length} listings across all companies</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all','active','draft','paused','closed'].map(s => (
          <button key={s}
            className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
            style={{ textTransform: 'capitalize' }}>
            {s} ({s==='all' ? internships.length : internships.filter(i=>i.status===s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="table-wrap"><div className="empty-state"><div className="empty-title">No internships found</div></div></div>
      ) : (
        <div className="table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title','Company','Type','Stipend','Duration','Openings','Skills','Status','Posted'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', textAlign: 'left', background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item._id || i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{item.role}</div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={item.companyName||'?'} i={i} size={26}/>
                      {item.companyName}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: 12, textTransform: 'capitalize', padding: '3px 8px', borderRadius: 99, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: item.stipend==='paid' ? '#10b981' : 'var(--text-2)' }}>
                    {item.stipend==='paid' ? `₹${item.salary?.toLocaleString()}/mo` : 'Unpaid'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{item.duration}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.openings}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(item.skills||[]).slice(0,3).map(s=>(
                        <span key={s} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 99, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{s}</span>
                      ))}
                      {(item.skills||[]).length > 3 && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>+{item.skills.length-3}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}><Badge status={item.status}/></td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
//  ALL APPLICATIONS PAGE
// ─────────────────────────────────────────────
function AllApplicationsPage({ applicants, search }) {
  const [filter, setFilter] = useState('all')

  const counts = {
    all:         applicants.length,
    applied:     applicants.filter(a=>a.status==='applied').length,
    review:      applicants.filter(a=>a.status==='review').length,
    shortlisted: applicants.filter(a=>a.status==='shortlisted').length,
    hired:       applicants.filter(a=>a.status==='hired').length,
    rejected:    applicants.filter(a=>a.status==='rejected').length,
  }

  const filtered = applicants.filter(a => {
    const ms = filter==='all' || a.status===filter
    const mq = !search || a.applicantName?.toLowerCase().includes(search.toLowerCase()) || a.internshipTitle?.toLowerCase().includes(search.toLowerCase()) || a.companyName?.toLowerCase().includes(search.toLowerCase())
    return ms && mq
  })

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="section-title">All Applications</div>
          <div className="section-sub">{applicants.length} total applications across all internships</div>
        </div>
        {/* Summary */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Hired',    count: counts.hired,    bg: '#d1fae5', color: '#065f46' },
            { label: 'Rejected', count: counts.rejected, bg: '#fee2e2', color: '#991b1b' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-filters">
          {['all','applied','review','shortlisted','hired','rejected'].map(f => (
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
              {f==='all' ? `All (${counts.all})` : f.charAt(0).toUpperCase()+f.slice(1)+` (${counts[f]})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-title">No applications in this category</div></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Candidate','Email','Internship','Company','Stipend','Cover Letter','Resume','Applied On','Status'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', textAlign: 'left', background: 'var(--bg)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a._id || i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={a.applicantName||'?'} i={i} size={30}/>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{a.applicantName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-2)' }}>{a.applicantEmail}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13 }}>{a.internshipTitle}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{a.companyName}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: a.stipend==='paid'?'#10b981':'var(--text-2)' }}>
                    {a.stipend==='paid' ? `₹${a.salary?.toLocaleString()}/mo` : 'Unpaid'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {a.coverLetter
                      ? <span style={{ fontSize: 12, padding: '3px 8px', background: '#d1fae5', color: '#065f46', borderRadius: 99, fontWeight: 600 }}>✓ Yes</span>
                      : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>None</span>
                    }
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {a.resumeName
                      ? <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>📄 {a.resumeName.length > 15 ? a.resumeName.slice(0,15)+'...' : a.resumeName}</span>
                      : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Not uploaded</span>
                    }
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                    {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}><Badge status={a.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdminUser = user?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL

  // Redirect if not admin
  useEffect(() => {
    if (!token || !isAdminUser) navigate('/login', { replace: true })
  }, [token, isAdminUser, navigate])

  const [activePage,   setActivePage]  = useState('overview')
  const [internships,  setInternships] = useState([])
  const [applicants,   setApplicants]  = useState([])
  const [companies,    setCompanies]   = useState([])
  const [candidates,   setCandidates]  = useState([])
  const [loading,      setLoading]     = useState(true)
  const [search,       setSearch]      = useState('')

  const fetchAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const [intRes, appRes] = await Promise.all([
        fetch(`${API}/api/internships/public`,       { headers }),
        fetch(`${API}/api/applications/admin/all`,   { headers }),
      ])

      const currentInternships = intRes.ok ? await intRes.json().catch(() => []) : []
      const currentApplicants = appRes.ok ? await appRes.json().catch(() => []) : []

      setInternships(Array.isArray(currentInternships) ? currentInternships : [])
      setApplicants(Array.isArray(currentApplicants) ? currentApplicants : [])

      const companyMap = new Map()
      ;(Array.isArray(currentInternships) ? currentInternships : []).forEach(item => {
        const name = item.companyName?.trim()
        if (!name || companyMap.has(name)) return
        companyMap.set(name, {
          _id: name,
          name,
          email: item.companyEmail || '',
          industry: item.companyIndustry || '',
          website: item.companyWebsite || '',
          createdAt: item.createdAt,
        })
      })

      const candidateMap = new Map()
      ;(Array.isArray(currentApplicants) ? currentApplicants : []).forEach(item => {
        const email = item.applicantEmail?.trim()
        if (!email || candidateMap.has(email)) return
        candidateMap.set(email, {
          _id: email,
          name: item.applicantName || email.split('@')[0],
          email,
          createdAt: item.createdAt,
        })
      })

      setCompanies(Array.from(companyMap.values()))
      setCandidates(Array.from(candidateMap.values()))

    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const PAGE_TITLES = {
    overview:      'Admin Dashboard',
    organizations: 'Organizations',
    candidates:    'Candidates',
    internships:   'All Internships',
    applications:  'All Applications',
  }

  return (
    <div className="dash-layout">
      <AdminSidebar active={activePage} onNav={setActivePage} user={user} onLogout={handleLogout}/>

      <div className="main">
        <AdminTopbar
          title={PAGE_TITLES[activePage]}
          search={search}
          onSearch={setSearch}
          onLogout={handleLogout}
          user={user}
        />

        <div className="page-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>
              <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 600 }}>Loading admin data...</div>
            </div>
          ) : (
            <>
              {activePage === 'overview'      && <OverviewPage internships={internships} applicants={applicants} companies={companies} candidates={candidates}/>}
              {activePage === 'organizations' && <OrganizationsPage companies={companies} internships={internships} applicants={applicants} search={search}/>}
              {activePage === 'candidates'    && <CandidatesPage candidates={candidates} applicants={applicants} search={search}/>}
              {activePage === 'internships'   && <AllInternshipsPage internships={internships} search={search}/>}
              {activePage === 'applications'  && <AllApplicationsPage applicants={applicants} search={search}/>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}