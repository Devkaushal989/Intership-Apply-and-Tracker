import { useState, useEffect, useCallback } from 'react'
import CandidateReviewModal from './CandidateReviewModal'

const API = 'http://localhost:5000'

const STATUS_CONFIG = {
  applied:     { label: 'Applied',      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  review:      { label: 'Under Review', color: '#67e8f9', bg: 'rgba(103,232,249,0.1)' },
  shortlisted: { label: 'Shortlisted',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
  hired:       { label: 'Hired',        color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  rejected:    { label: 'Rejected',     color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
}

const AV_COLORS = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']

function calculateATSScore(applicant, internship) {
  let score = 0
  const text = [applicant.applicantName, applicant.coverLetter, applicant.resumeName]
    .join(' ').toLowerCase()
  const skills = internship?.skills || []
  const matched = skills.filter(s => text.includes(s.toLowerCase()))
  if (skills.length > 0) score += Math.round((matched.length / skills.length) * 40)
  else score += 20
  const coverLen = (applicant.coverLetter || '').length
  score += coverLen > 300 ? 25 : coverLen > 150 ? 18 : coverLen > 50 ? 10 : 0
  if (applicant.resumeName) score += 20
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.applicantEmail || '')) score += 15
  return score
}

const S = {
  page: { padding: '28px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 },
  sub:   { fontSize: 14, color: '#64748b' },
  card:  {
    background: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, overflow: 'hidden',
  },
  filterBar: {
    display: 'flex', gap: 8, padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap', alignItems: 'center',
  },
  filterTab: (active) => ({
    padding: '6px 14px', borderRadius: 8,
    border: `1px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
    background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
    color: active ? '#a78bfa' : '#64748b',
    fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  }),
  searchInput: {
    flex: 1, minWidth: 200,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '8px 14px 8px 36px',
    fontSize: 13.5, color: '#f1f5f9',
    fontFamily: 'inherit', outline: 'none',
  },
  th: {
    padding: '12px 16px', fontSize: 11.5, fontWeight: 600,
    color: '#475569', textAlign: 'left',
    textTransform: 'uppercase', letterSpacing: '0.6px',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px', fontSize: 13.5, color: '#e2e8f0',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'middle',
  },
  reviewBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
    color: '#a78bfa', cursor: 'pointer',
    fontSize: 12.5, fontWeight: 600,
    fontFamily: 'inherit', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
}

export default function ApplicantsReviewPage({ token, internships = [] }) {
  const [applicants,    setApplicants]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all')
  const [search,        setSearch]        = useState('')
  const [reviewTarget,  setReviewTarget]  = useState(null)
  const [statuses,      setStatuses]      = useState({})

  const fetchApplicants = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/applications/company`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const arr  = Array.isArray(data) ? data : []
        setApplicants(arr)
        const map = {}
        arr.forEach(a => { map[a._id] = a.status })
        setStatuses(map)
      }
    } catch (err) {
      console.error('Fetch applicants error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchApplicants() }, [fetchApplicants])

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/api/applications/${id}/status`, {
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setStatuses(prev => ({ ...prev, [id]: status }))
        setApplicants(prev => prev.map(a => a._id === id ? { ...a, status } : a))
      }
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  // Find matching internship for ATS
  const getInternship = (app) =>
    internships.find(i => i._id === app.internshipId || i.title === app.internshipTitle)

  const filtered = applicants.filter(a => {
    const st = statuses[a._id] || a.status
    const ms = filter === 'all' || st === filter
    const mq = !search ||
      a.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
      a.internshipTitle?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicantEmail?.toLowerCase().includes(search.toLowerCase())
    return ms && mq
  })

  const counts = {
    all:         applicants.length,
    applied:     applicants.filter(a => (statuses[a._id] || a.status) === 'applied').length,
    review:      applicants.filter(a => (statuses[a._id] || a.status) === 'review').length,
    shortlisted: applicants.filter(a => (statuses[a._id] || a.status) === 'shortlisted').length,
    hired:       applicants.filter(a => (statuses[a._id] || a.status) === 'hired').length,
    rejected:    applicants.filter(a => (statuses[a._id] || a.status) === 'rejected').length,
  }

  return (
    <div style={S.page}>

      {/* Page Header */}
      <div style={S.header}>
        <div>
          <div style={S.title}>Candidate Review</div>
          <div style={S.sub}>
            {applicants.length} total applicants · ATS-powered resume screening
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total',       value: counts.all,         color: '#a78bfa' },
            { label: 'Shortlisted', value: counts.shortlisted, color: '#fbbf24' },
            { label: 'Hired',       value: counts.hired,       color: '#34d399' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '10px 18px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div style={S.card}>

        {/* Filter Bar */}
        <div style={S.filterBar}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#475569', pointerEvents: 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              style={S.searchInput}
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Tabs */}
          {['all','applied','review','shortlisted','hired','rejected'].map(f => (
            <button
              key={f}
              style={S.filterTab(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? `All (${counts.all})` :
               f.charAt(0).toUpperCase() + f.slice(1) + ` (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            Loading applicants...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
              No applicants found
            </div>
            <div style={{ fontSize: 13.5 }}>
              {filter !== 'all' ? 'Try a different filter' : 'No one has applied yet'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Candidate','Applied For','ATS Score','Applied On','Status','Action'].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const st      = statuses[app._id] || app.status
                  const sc      = STATUS_CONFIG[st] || STATUS_CONFIG.applied
                  const intern  = getInternship(app)
                  const atsScore = calculateATSScore(app, intern)
                  const atsColor =
                    atsScore >= 80 ? '#10b981' :
                    atsScore >= 60 ? '#f59e0b' :
                    atsScore >= 40 ? '#6366f1' : '#ef4444'

                  return (
                    <tr key={app._id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Candidate */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: `${AV_COLORS[i % AV_COLORS.length]}22`,
                            border: `1px solid ${AV_COLORS[i % AV_COLORS.length]}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                            color: AV_COLORS[i % AV_COLORS.length],
                            flexShrink: 0, fontFamily: 'Sora',
                          }}>
                            {app.applicantName?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{app.applicantName}</div>
                            <div style={{ fontSize: 12, color: '#475569' }}>{app.applicantEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ ...S.td, color: '#94a3b8', fontSize: 13 }}>
                        {app.internshipTitle}
                      </td>

                      {/* ATS Score */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: `${atsColor}18`,
                            border: `2px solid ${atsColor}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 800,
                            color: atsColor, fontFamily: 'Sora',
                            flexShrink: 0,
                          }}>
                            {atsScore}
                          </div>
                          <div style={{
                            height: 5, flex: 1, minWidth: 60,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 99, overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', width: `${atsScore}%`,
                              background: atsColor, borderRadius: 99,
                              transition: 'width 0.6s ease',
                            }}/>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ ...S.td, color: '#475569', fontSize: 13 }}>
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        <span style={{
                          fontSize: 11.5, fontWeight: 600,
                          padding: '4px 10px', borderRadius: 99,
                          color: sc.color, background: sc.bg,
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%',
                            background: sc.color, display: 'inline-block' }}/>
                          {sc.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={S.td}>
                        <button
                          style={S.reviewBtn}
                          onClick={() => setReviewTarget(app)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Review & ATS
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewTarget && (
        <CandidateReviewModal
          applicant={reviewTarget}
          internship={getInternship(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          onUpdateStatus={async (id, status) => {
            await handleUpdateStatus(id, status)
            setReviewTarget(prev => prev ? { ...prev, status } : null)
          }}
        />
      )}
    </div>
  )
}