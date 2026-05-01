import { useState } from 'react'

// ── ATS Score Calculator ──
function calculateATS(applicant, internship) {
  let score = 0
  const breakdown = []
  const text = [applicant.applicantName, applicant.coverLetter, applicant.resumeName]
    .join(' ').toLowerCase()
  const required = internship?.skills || []

  // Skills (40pts)
  const matched = required.filter(s => text.includes(s.toLowerCase()))
  const missing = required.filter(s => !text.includes(s.toLowerCase()))
  const skillScore = required.length > 0 ? Math.round((matched.length / required.length) * 40) : 20
  score += skillScore
  breakdown.push({
    category: 'Skills Match', score: skillScore, max: 40,
    detail: matched.length > 0 ? `Matched: ${matched.join(', ')}` : 'No skill keywords found',
  })

  // Cover letter (25pts)
  const cl = (applicant.coverLetter || '').length
  const clScore = cl > 300 ? 25 : cl > 150 ? 18 : cl > 50 ? 10 : 0
  score += clScore
  breakdown.push({
    category: 'Cover Letter', score: clScore, max: 25,
    detail: cl > 300 ? 'Detailed cover letter' : cl > 150 ? 'Moderate cover letter' : cl > 50 ? 'Brief cover letter' : 'No cover letter',
  })

  // Resume (20pts)
  const rScore = applicant.resumeName ? 20 : 0
  score += rScore
  breakdown.push({
    category: 'Resume Uploaded', score: rScore, max: 20,
    detail: applicant.resumeName || 'No resume uploaded',
  })

  // Email (15pts)
  const eScore = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.applicantEmail || '') ? 15 : 0
  score += eScore
  breakdown.push({
    category: 'Profile Completeness', score: eScore, max: 15,
    detail: eScore ? 'Valid email provided' : 'Invalid or missing email',
  })

  const grade =
    score >= 80 ? { label: 'Excellent', color: '#10b981', bg: '#d1fae5', text: '#065f46' } :
    score >= 60 ? { label: 'Good',      color: '#f59e0b', bg: '#fef3c7', text: '#92400e' } :
    score >= 40 ? { label: 'Average',   color: '#6366f1', bg: '#ede9fe', text: '#5b21b6' } :
                  { label: 'Poor',      color: '#ef4444', bg: '#fee2e2', text: '#991b1b' }

  return { score, breakdown, grade, matched, missing }
}

// ── Score Ring SVG ──
function ScoreRing({ score }) {
  const r = 48, circ = 2 * Math.PI * r
  const dash  = (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#6366f1' : '#ef4444'
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="11"/>
      <circle cx="60" cy="60" r={r} fill="none"
        stroke={color} strokeWidth="11"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="60" y="55" textAnchor="middle" fill="#111" fontSize="22" fontWeight="800" fontFamily="Sora,sans-serif">{score}</text>
      <text x="60" y="72" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="DM Sans,sans-serif">ATS Score</text>
    </svg>
  )
}

export default function CandidateReviewModal({ applicant, internship, onClose, onUpdateStatus }) {
  const [updating, setUpdating]           = useState(false)
  const [currentStatus, setCurrentStatus] = useState(applicant.status)
  const ats = calculateATS(applicant, internship)

  const handleStatus = async (status) => {
    setUpdating(true)
    await onUpdateStatus(applicant._id, status)
    setCurrentStatus(status)
    setUpdating(false)
  }

  const STATUS_MAP = {
    applied:     { label: 'Applied',      cls: 'badge-draft'  },
    review:      { label: 'Under Review', cls: 'badge-paused' },
    shortlisted: { label: 'Shortlisted',  cls: 'badge-paused' },
    hired:       { label: 'Hired',        cls: 'badge-active' },
    rejected:    { label: 'Rejected',     cls: 'badge-closed' },
  }
  const sc = STATUS_MAP[currentStatus] || STATUS_MAP.applied

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Candidate Review — ATS Analysis</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{applicant.internshipTitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`status-badge ${sc.cls}`}>{sc.label}</span>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body">

          {/* Top row: candidate info + ATS ring */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>

            {/* Candidate info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: 'var(--primary)',
                  flexShrink: 0,
                }}>
                  {applicant.applicantName?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                    {applicant.applicantName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{applicant.applicantEmail}</div>
                </div>
              </div>

              <div className="detail-grid">
                {[
                  ['Applied For',   applicant.internshipTitle],
                  ['Company',       applicant.companyName],
                  ['Type',          applicant.internshipType],
                  ['Applied On',    applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'],
                  ['Stipend',       applicant.stipend === 'paid' ? `₹${applicant.salary?.toLocaleString()}/mo` : 'Unpaid'],
                ].map(([label, value]) => (
                  <div className="detail-section" key={label}>
                    <div className="detail-label">{label}</div>
                    <div className="detail-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Ring */}
            <div style={{
              background: 'var(--bg)', border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '20px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              minWidth: 150,
            }}>
              <ScoreRing score={ats.score} />
              <span style={{
                fontSize: 12.5, fontWeight: 700,
                color: ats.grade.text,
                background: ats.grade.bg,
                padding: '4px 12px', borderRadius: 99,
              }}>
                {ats.grade.label} Match
              </span>
            </div>
          </div>

          {/* ATS Breakdown */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              📊 ATS Resume Analysis
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ats.breakdown.map((b, i) => (
                <div key={i} style={{
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  borderRadius: 10, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{b.category}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{b.score}/{b.max}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${(b.score / b.max) * 100}%`,
                      background: b.score/b.max >= 0.7 ? '#10b981' : b.score/b.max >= 0.4 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.8s ease',
                    }}/>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{b.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {(ats.matched.length > 0 || ats.missing.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {ats.matched.length > 0 && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#15803d', marginBottom: 8 }}>✓ Matched Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ats.matched.map(s => (
                      <span key={s} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 99, background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {ats.missing.length > 0 && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginBottom: 8 }}>✗ Missing Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ats.missing.map(s => (
                      <span key={s} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 99, background: '#fee2e2', color: '#991b1b', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Sora', fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                📝 Cover Letter
              </div>
              <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                {applicant.coverLetter}
              </div>
            </div>
          )}

          {/* Resume */}
          {applicant.resumeName && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Sora', fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                📄 Resume
              </div>
              <div className="resume-btn" style={{ display: 'inline-flex', cursor: 'default' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                {applicant.resumeName}
              </div>
            </div>
          )}

          {/* ATS Recommendation Banner */}
          <div style={{
            background: ats.score >= 60 ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${ats.score >= 60 ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: 10, padding: '14px 16px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: ats.score >= 60 ? '#15803d' : '#dc2626', marginBottom: 3 }}>
              {ats.score >= 80 ? '🟢 Strongly recommend for hire' :
               ats.score >= 60 ? '🟡 Good candidate — worth interviewing' :
               ats.score >= 40 ? '🟠 Average match — review carefully' :
                                 '🔴 Poor match for this role'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
              Based on skills alignment, cover letter quality, and profile completeness.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { status: 'review',      label: '👁 Under Review', cls: 'btn btn-outline btn-sm' },
              { status: 'shortlisted', label: '⭐ Shortlist',    cls: 'btn btn-outline btn-sm' },
              { status: 'hired',       label: '✅ Accept / Hire', cls: 'btn btn-primary btn-sm', highlight: true },
              { status: 'rejected',    label: '❌ Reject',        cls: 'btn btn-danger btn-sm' },
            ].map(({ status, label, cls }) => (
              <button
                key={status}
                className={cls}
                disabled={updating || currentStatus === status}
                onClick={() => handleStatus(status)}
                style={{ flex: 1, opacity: currentStatus === status ? 0.5 : 1 }}
              >
                {updating && currentStatus !== status ? '...' : label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}