import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanySidebar         from '../components/CompanySidebar'
import CompanyTopbar          from '../components/CompanyTopbar'
import CompanyStatsGrid       from '../components/CompanyStatsGrid'
import CompanyInternshipList  from '../components/CompanyInternshipList'
import CompanyInternshipModal from '../components/CompanyInternshipModal'
import ApplicantsReviewPage   from '../components/ApplicantsReviewPage'  // ← NEW
import '../Dashboard.css'

const API = 'http://localhost:5000'

export default function CompanyDashboard() {
  const navigate = useNavigate()

  const token   = localStorage.getItem('companyToken')
  const profile = JSON.parse(localStorage.getItem('companyProfile') || '{}')
  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'CO'

  const [activePage,    setActivePage]   = useState('dashboard')
  const [internships,   setInternships]  = useState([])
  const [loading,       setLoading]      = useState(true)
  const [showModal,     setShowModal]    = useState(false)
  const [editItem,      setEditItem]     = useState(null)
  const [viewItem,      setViewItem]     = useState(null)
  const [searchQuery,   setSearchQuery]  = useState('')
  const [statusFilter,  setStatusFilter] = useState('all')
  const [pendingCount,  setPendingCount] = useState(0)

  // ── Fetch internships ──
  const fetchInternships = useCallback(async () => {
    if (!token) { navigate('/login'); return }
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/internships`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { handleLogout(); return }
      const data = await res.json()
      setInternships(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  // ── Fetch pending applicant count for badge ──
  const fetchPendingCount = useCallback(async () => {
    if (!token) return
    try {
      const res  = await fetch(`${API}/api/applications/company`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const pending = Array.isArray(data)
          ? data.filter(a => a.status === 'applied').length
          : 0
        setPendingCount(pending)
      }
    } catch (err) { /* silent */ }
  }, [token])

  useEffect(() => {
    fetchInternships()
    fetchPendingCount()
  }, [fetchInternships, fetchPendingCount])

  const handleLogout = () => {
    localStorage.removeItem('companyToken')
    localStorage.removeItem('companyProfile')
    navigate('/login')
  }

  const handleSave = async (formData) => {
    try {
      const method = editItem ? 'PUT' : 'POST'
      const url    = editItem
        ? `${API}/api/internships/${editItem._id}`
        : `${API}/api/internships`
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Error saving'); return }
      await fetchInternships()
      setShowModal(false)
      setEditItem(null)
    } catch (err) {
      alert('Server error. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return
    try {
      const res = await fetch(`${API}/api/internships/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) await fetchInternships()
    } catch (err) { alert('Delete failed.') }
  }

  const handleEdit = (item) => { setEditItem(item); setShowModal(true) }

  const stats = {
    total:   internships.length,
    active:  internships.filter(i => i.status === 'active').length,
    draft:   internships.filter(i => i.status === 'draft').length,
    paused:  internships.filter(i => i.status === 'paused').length,
  }

  const filtered = internships.filter(i => {
    const ms = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())
    const mf = statusFilter === 'all' || i.status === statusFilter
    return ms && mf
  })

  const pageTitle =
    activePage === 'dashboard'   ? 'Dashboard'          :
    activePage === 'internships' ? 'Internships'        :
    activePage === 'review'      ? 'Candidate Review'   : 'Dashboard'

  return (
    <div className="dash-layout">
      <CompanySidebar
        active={activePage}
        onNav={setActivePage}
        orgName={profile.name || 'Company'}
        initials={initials}
        counts={{ internships: internships.length, pending: pendingCount }}
      />

      <div className="main">
        <CompanyTopbar
          title={pageTitle}
          initials={initials}
          companyName={profile.name}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onLogout={handleLogout}
        />

        <div className="page-content">

          {/* ── DASHBOARD ── */}
          {activePage === 'dashboard' && (
            <>
              <CompanyStatsGrid stats={stats} />
              <div className="section-header">
                <div>
                  <div className="section-title">Recent Internships</div>
                  <div className="section-sub">Your latest posted listings</div>
                </div>
                <button className="btn btn-primary"
                  onClick={() => { setEditItem(null); setShowModal(true) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Post Internship
                </button>
              </div>
              <CompanyInternshipList
                internships={internships.slice(0, 6)}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={setViewItem}
              />
            </>
          )}

          {/* ── INTERNSHIPS ── */}
          {activePage === 'internships' && (
            <>
              <div className="section-header">
                <div>
                  <div className="section-title">All Internships</div>
                  <div className="section-sub">{internships.length} total listings</div>
                </div>
                <button className="btn btn-primary"
                  onClick={() => { setEditItem(null); setShowModal(true) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Post Internship
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {['all','active','draft','paused','closed'].map(s => (
                  <button key={s}
                    className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                    style={{ textTransform: 'capitalize' }}>
                    {s} ({s === 'all' ? internships.length : internships.filter(i => i.status === s).length})
                  </button>
                ))}
              </div>
              <CompanyInternshipList
                internships={filtered} loading={loading}
                onEdit={handleEdit} onDelete={handleDelete} onView={setViewItem}
              />
            </>
          )}

          {/* ── CANDIDATE REVIEW ── */}
          {activePage === 'review' && (
            <ApplicantsReviewPage
              token={token}
              internships={internships}
            />
          )}

        </div>
      </div>

      {/* Post/Edit Modal */}
      {showModal && (
        <CompanyInternshipModal
          initial={editItem}
          companyName={profile.name || ''}
          onClose={() => { setShowModal(false); setEditItem(null) }}
          onSave={handleSave}
        />
      )}

      {/* View Detail Modal */}
      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{viewItem.title}</div>
              <button className="modal-close" onClick={() => setViewItem(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid" style={{ marginBottom: 20 }}>
                <div className="detail-section"><div className="detail-label">Company</div><div className="detail-value">{viewItem.companyName}</div></div>
                <div className="detail-section"><div className="detail-label">Role / Department</div><div className="detail-value">{viewItem.role}</div></div>
                <div className="detail-section"><div className="detail-label">Type</div><div className="detail-value" style={{ textTransform: 'capitalize' }}>{viewItem.type}</div></div>
                <div className="detail-section"><div className="detail-label">Duration</div><div className="detail-value">{viewItem.duration}</div></div>
                <div className="detail-section"><div className="detail-label">Openings</div><div className="detail-value">{viewItem.openings} position{viewItem.openings > 1 ? 's' : ''}</div></div>
                <div className="detail-section">
                  <div className="detail-label">Stipend</div>
                  <div>
                    {viewItem.stipend === 'paid'
                      ? <div className="salary-highlight">₹{viewItem.salary?.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>/month</span></div>
                      : <span className="tag tag-unpaid">Unpaid</span>
                    }
                  </div>
                </div>
              </div>
              {viewItem.skills?.length > 0 && (
                <div className="detail-section">
                  <div className="detail-label">Required Skills</div>
                  <div className="card-tags" style={{ marginTop: 8 }}>
                    {viewItem.skills.map(s => <span key={s} className="tag tag-skill">{s}</span>)}
                  </div>
                </div>
              )}
              <div className="detail-section"><div className="detail-label">Description</div><div className="detail-value">{viewItem.description}</div></div>
              {viewItem.requirements && (
                <div className="detail-section"><div className="detail-label">Requirements</div><div className="detail-value">{viewItem.requirements}</div></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setViewItem(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => { setViewItem(null); handleEdit(viewItem) }}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}