import { useState } from 'react'
import Sidebar        from '../components/Sidebar'
import Topbar         from '../components/Topbar'
import StatsGrid      from '../components/StatsGrid'
import InternshipList from '../components/InternshipList'
import AddInternshipModal from '../components/AddInternshipModal'
import ApplicantsTable   from '../components/ApplicantsTable'
import '../Dashboard.css'

// ── Sample Data ──
const SAMPLE_INTERNSHIPS = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    role: 'Engineering',
    type: 'remote',
    stipend: 'paid',
    salary: 15000,
    duration: '3 months',
    openings: 3,
    skills: ['React', 'CSS', 'JavaScript', 'Git'],
    description: 'Work with our product team to build modern web interfaces. You will collaborate closely with senior engineers on real-world projects used by thousands of customers.',
    status: 'active',
    applicants: 24,
    postedDate: '2025-04-01',
  },
  {
    id: 2,
    title: 'Data Science Intern',
    company: 'TechNova Solutions',
    role: 'Data & Analytics',
    type: 'hybrid',
    stipend: 'paid',
    salary: 18000,
    duration: '6 months',
    openings: 2,
    skills: ['Python', 'Pandas', 'SQL', 'ML Basics'],
    description: 'Analyze large datasets and help build predictive models. Gain hands-on experience with real business data and cutting-edge ML tools.',
    status: 'active',
    applicants: 41,
    postedDate: '2025-03-28',
  },
  {
    id: 3,
    title: 'UI/UX Design Intern',
    company: 'TechNova Solutions',
    role: 'Design',
    type: 'onsite',
    stipend: 'unpaid',
    salary: 0,
    duration: '2 months',
    openings: 1,
    skills: ['Figma', 'Prototyping', 'User Research'],
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work on wireframes, prototypes, and usability testing.',
    status: 'draft',
    applicants: 8,
    postedDate: '2025-04-05',
  },
]

const SAMPLE_APPLICANTS = [
  { id: 1, name: 'Aarav Singh',    email: 'aarav@example.com',   role: 'Frontend Developer Intern', status: 'review',    date: '2025-04-06', color: '#4f46e5' },
  { id: 2, name: 'Priya Sharma',   email: 'priya@example.com',   role: 'Data Science Intern',       status: 'shortlisted', date: '2025-04-05', color: '#06b6d4' },
  { id: 3, name: 'Rohan Mehta',    email: 'rohan@example.com',   role: 'Frontend Developer Intern', status: 'rejected',  date: '2025-04-04', color: '#10b981' },
  { id: 4, name: 'Sneha Patel',    email: 'sneha@example.com',   role: 'UI/UX Design Intern',       status: 'review',    date: '2025-04-03', color: '#f59e0b' },
  { id: 5, name: 'Karan Verma',    email: 'karan@example.com',   role: 'Data Science Intern',       status: 'hired',     date: '2025-04-02', color: '#ef4444' },
]

export default function Dashboard() {
  const [activePage, setActivePage]     = useState('dashboard')
  const [internships, setInternships]   = useState(SAMPLE_INTERNSHIPS)
  const [applicants]                    = useState(SAMPLE_APPLICANTS)
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState(null)
  const [viewItem, setViewItem]         = useState(null)
  const [searchQuery, setSearchQuery]   = useState('')

  const orgName = JSON.parse(localStorage.getItem('user') || '{}')?.name || 'TechNova Solutions'
  const initials = orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Stats
  const stats = {
    total:       internships.length,
    active:      internships.filter(i => i.status === 'active').length,
    applicants:  applicants.length,
    hired:       applicants.filter(a => a.status === 'hired').length,
  }

  const handleSave = (data) => {
    if (editItem) {
      setInternships(prev => prev.map(i => i.id === editItem.id ? { ...i, ...data } : i))
    } else {
      setInternships(prev => [...prev, { ...data, id: Date.now(), applicants: 0, postedDate: new Date().toISOString().split('T')[0] }])
    }
    setShowModal(false)
    setEditItem(null)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this internship?')) {
      setInternships(prev => prev.filter(i => i.id !== id))
    }
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setShowModal(true)
  }

  return (
    <div className="dash-layout">
      <Sidebar
        active={activePage}
        onNav={setActivePage}
        orgName={orgName}
        initials={initials}
        applicantCount={applicants.filter(a => a.status === 'review').length}
      />

      <div className="main">
        <Topbar
          title={
            activePage === 'dashboard'  ? 'Dashboard'     :
            activePage === 'internships'? 'Internships'   :
            activePage === 'applicants' ? 'Applicants'    : 'Dashboard'
          }
          initials={initials}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <div className="page-content">

          {/* ── DASHBOARD HOME ── */}
          {activePage === 'dashboard' && (
            <>
              <StatsGrid stats={stats} />
              <div className="section-header">
                <div>
                  <div className="section-title">Active Internships</div>
                  <div className="section-sub">Your currently posted internship listings</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Post Internship
                </button>
              </div>
              <InternshipList
                internships={internships.filter(i => i.status === 'active').slice(0, 4)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={setViewItem}
              />
            </>
          )}

          {/* ── INTERNSHIPS PAGE ── */}
          {activePage === 'internships' && (
            <>
              <div className="section-header">
                <div>
                  <div className="section-title">All Internships</div>
                  <div className="section-sub">{internships.length} listings posted</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Post Internship
                </button>
              </div>
              <InternshipList
                internships={internships.filter(i =>
                  !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={setViewItem}
              />
            </>
          )}

          {/* ── APPLICANTS PAGE ── */}
          {activePage === 'applicants' && (
            <>
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <div className="section-title">All Applicants</div>
                  <div className="section-sub">{applicants.length} total applicants across all listings</div>
                </div>
              </div>
              <ApplicantsTable applicants={applicants} />
            </>
          )}

        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <AddInternshipModal
          initial={editItem}
          onClose={() => { setShowModal(false); setEditItem(null) }}
          onSave={handleSave}
          orgName={orgName}
        />
      )}

      {/* ── VIEW DETAIL MODAL ── */}
      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{viewItem.title}</div>
              <button className="modal-close" onClick={() => setViewItem(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid" style={{ marginBottom: 20 }}>
                <div className="detail-section">
                  <div className="detail-label">Company</div>
                  <div className="detail-value">{viewItem.company}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Role / Department</div>
                  <div className="detail-value">{viewItem.role}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Internship Type</div>
                  <div className="detail-value" style={{ textTransform: 'capitalize' }}>{viewItem.type}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{viewItem.duration}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Openings</div>
                  <div className="detail-value">{viewItem.openings} positions</div>
                </div>
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
              <div className="detail-section">
                <div className="detail-label">Required Skills</div>
                <div className="card-tags" style={{ marginTop: 6 }}>
                  {viewItem.skills.map(s => <span key={s} className="tag tag-skill">{s}</span>)}
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Description</div>
                <div className="detail-value">{viewItem.description}</div>
              </div>
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