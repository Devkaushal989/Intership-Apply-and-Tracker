import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateTopbar    from '../components/CandidateTopbar'
import HomePage           from '../components/HomePage'
import TrackingPage       from '../components/TrackingPage'
import InternshipsPage    from '../components/InternshipsPage'
import MyApplicationsPage from '../components/MyApplicationsPage'
import '../Candidate.css'

const API = 'http://localhost:5000'

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const token  = localStorage.getItem('token')
  const user   = JSON.parse(localStorage.getItem('user') || '{}')

  const [activePage, setActivePage]   = useState('home')
  const [applications, setApplications] = useState([])

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login')
  }, [token])

  // Fetch this candidate's applications
  const fetchApplications = useCallback(async () => {
    if (!token) return
    try {
      const res  = await fetch(`${API}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Applications fetch error:', err)
    }
  }, [token])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  
  const handleApply = async (internship, formData) => {
    try {
      const res = await fetch(`${API}/api/applications`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          internshipId:    internship._id,
          internshipTitle: internship.title,
          companyName:     internship.companyName,
          internshipType:  internship.type,
          stipend:         internship.stipend,
          salary:          internship.salary,
          applicantName:   formData.name,
          applicantEmail:  formData.email,
          coverLetter:     formData.coverLetter,
          resumeName:      formData.resumeName,
        }),
      })
      if (res.ok) {
        await fetchApplications()
        alert(' Application submitted successfully!')
      } else {
        const d = await res.json()
        alert(d.message || 'Failed to apply')
      }
    } catch (err) {
      alert('Server error. Please try again.')
    }
  }

  return (
    <div className="c-page">
      <CandidateTopbar
        activePage={activePage}
        onNav={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      {activePage === 'home' && (
        <HomePage
          user={user}
          applications={applications}
          onNav={setActivePage}
        />
      )}
      {activePage === 'tracking' && (
        <TrackingPage applications={applications} />
      )}
      {activePage === 'internships' && (
        <InternshipsPage
          applications={applications}
          onApply={handleApply}
        />
      )}
      {activePage === 'applications' && (
        <MyApplicationsPage applications={applications} />
      )}
    </div>
  )
}