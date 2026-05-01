import { useState } from 'react'

export default function CompanyInternshipModal({ initial, companyName, onClose, onSave }) {
  const [form, setForm] = useState({
    title:        initial?.title        || '',
    companyName:  initial?.companyName  || companyName || '',
    role:         initial?.role         || '',
    type:         initial?.type         || 'remote',
    stipend:      initial?.stipend      || 'paid',
    salary:       initial?.salary       || '',
    duration:     initial?.duration     || '',
    openings:     initial?.openings     || 1,
    description:  initial?.description  || '',
    requirements: initial?.requirements || '',
    status:       initial?.status       || 'active',
    skills:       initial?.skills       || [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors]         = useState({})
  const [saving, setSaving]         = useState(false)

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const s = skillInput.trim().replace(/,$/, '')
      if (s && !form.skills.includes(s))
        setForm(f => ({ ...f, skills: [...f.skills, s] }))
      setSkillInput('')
    }
  }

  const removeSkill = (s) =>
    setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.companyName.trim()) e.companyName  = 'Company name is required'
    if (!form.role.trim())        e.role         = 'Role is required'
    if (!form.duration)           e.duration     = 'Duration is required'
    if (!form.description.trim()) e.description  = 'Description is required'
    if (form.stipend === 'paid' && !form.salary) e.salary = 'Salary is required for paid internships'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    await onSave({
      ...form,
      salary:   form.stipend === 'paid' ? Number(form.salary) : 0,
      openings: Number(form.openings),
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            {initial ? '✏️ Edit Internship' : '➕ Post New Internship'}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* ── Title ── */}
              <div className="form-group form-full">
                <label className="form-label">Internship Title *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Frontend Developer Intern"
                  value={form.title}
                  onChange={set('title')}
                />
                {errors.title && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.title}</span>}
              </div>

              {/* ── Company Name ── */}
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  className="form-input"
                  placeholder="Your company name"
                  value={form.companyName}
                  onChange={set('companyName')}
                />
                {errors.companyName && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.companyName}</span>}
              </div>

              {/* ── Role ── */}
              <div className="form-group">
                <label className="form-label">Role / Department *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Engineering, Design, Marketing"
                  value={form.role}
                  onChange={set('role')}
                />
                {errors.role && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.role}</span>}
              </div>

              <hr className="form-divider"/>

              {/* ── Internship Type ── */}
              <div className="form-group form-full">
                <label className="form-label">Internship Type *</label>
                <div className="radio-group">
                  {['remote', 'onsite', 'hybrid'].map(t => (
                    <label key={t} className={`radio-option ${form.type === t ? 'selected' : ''}`}>
                      <input type="radio" name="type" value={t} checked={form.type === t} onChange={set('type')}/>
                      {t === 'remote' ? <svg xmlns="http://www.w3.org/2000/svg"
     width="28" height="28"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

  
  <circle cx="12" cy="12" r="10"></circle>

  
  <line x1="12" y1="2" x2="12" y2="22"></line>

  
  <path d="M2 12h20"></path>

  <path d="M4 7c4 3 12 3 16 0"></path>
  <path d="M4 17c4-3 12-3 16 0"></path>

</svg> : t === 'onsite' ? <svg xmlns="http://www.w3.org/2000/svg"
     width="28" height="28"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

  
  <rect x="5" y="2" width="14" height="20" rx="2"></rect>

  <line x1="9" y1="6" x2="9" y2="6"></line>
  <line x1="15" y1="6" x2="15" y2="6"></line>

  <line x1="9" y1="10" x2="9" y2="10"></line>
  <line x1="15" y1="10" x2="15" y2="10"></line>

  <line x1="9" y1="14" x2="9" y2="14"></line>
  <line x1="15" y1="14" x2="15" y2="14"></line>

  <rect x="10" y="17" width="4" height="5"></rect>

</svg> : <svg xmlns="http://www.w3.org/2000/svg"
     width="28" height="28"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

  <polyline points="16 3 21 3 21 8"></polyline>
  <path d="M4 20l7-7"></path>
  <path d="M21 3l-7 7"></path>

  <polyline points="16 21 21 21 21 16"></polyline>
  <path d="M4 4l7 7"></path>
  <path d="M21 21l-7-7"></path>

</svg>} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Stipend ── */}
              <div className="form-group form-full">
                <label className="form-label">Stipend *</label>
                <div className="radio-group">
                  <label className={`radio-option ${form.stipend === 'paid' ? 'selected' : ''}`}>
                    <input type="radio" name="stipend" value="paid" checked={form.stipend === 'paid'} onChange={set('stipend')}/>
                    <svg xmlns="http://www.w3.org/2000/svg"
     width="28" height="28"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

  <rect x="2" y="6" width="20" height="12" rx="2"></rect>

  
  <circle cx="12" cy="12" r="3"></circle>

  <path d="M6 9c1 1 1 5 0 6"></path>
  <path d="M18 9c-1 1-1 5 0 6"></path>

</svg> Paid Internship
                  </label>
                  <label className={`radio-option ${form.stipend === 'unpaid' ? 'selected' : ''}`}>
                    <input type="radio" name="stipend" value="unpaid" checked={form.stipend === 'unpaid'} onChange={set('stipend')}/>
                    <svg xmlns="http://www.w3.org/2000/svg"
     width="28" height="28"
     viewBox="0 0 24 24"
     fill="black"
     stroke="black"
     stroke-width="1.5"
     stroke-linecap="round"
     stroke-linejoin="round">

  
  <polygon points="12 3 2 8 12 13 22 8 12 3"></polygon>

  <path d="M6 10v4c0 2 3 4 6 4s6-2 6-4v-4"></path>

  <line x1="22" y1="8" x2="22" y2="14"></line>
  <circle cx="22" cy="16" r="1"></circle>

</svg> Unpaid / Certificate Only
                  </label>
                </div>
              </div>

              {/* ── Monthly Salary (conditional) ── */}
              {form.stipend === 'paid' && (
                <div className="form-group">
                  <label className="form-label">Monthly Salary (₹) *</label>
                  <div className="salary-row">
                    <span className="salary-prefix">₹</span>
                    <input
                      className="form-input"
                      type="number" min="0"
                      placeholder="e.g. 15000"
                      value={form.salary}
                      onChange={set('salary')}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {errors.salary && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.salary}</span>}
                </div>
              )}

              {/* ── Duration ── */}
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <select className="form-select" value={form.duration} onChange={set('duration')}>
                  <option value="">Select duration</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
                {errors.duration && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.duration}</span>}
              </div>

              {/* ── Openings ── */}
              <div className="form-group">
                <label className="form-label">Number of Openings</label>
                <input
                  className="form-input"
                  type="number" min="1"
                  value={form.openings}
                  onChange={set('openings')}
                />
              </div>

              {/* ── Status ── */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  <option value="active">🟢 Active</option>
                  <option value="draft">⚪ Draft</option>
                  <option value="paused">🟡 Paused</option>
                  <option value="closed">🔴 Closed</option>
                </select>
              </div>

              <hr className="form-divider"/>

              {/* ── Skills ── */}
              <div className="form-group form-full">
                <label className="form-label">Required Skills</label>
                <div
                  className="skills-tags"
                  onClick={() => document.getElementById('skillInput').focus()}
                >
                  {form.skills.map(s => (
                    <span key={s} className="skill-tag-input">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))}
                  <input
                    id="skillInput"
                    className="skills-text-input"
                    placeholder={form.skills.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                </div>
                <div className="skills-hint">Press Enter or comma after each skill</div>
              </div>

              {/* ── Description ── */}
              <div className="form-group form-full">
                <label className="form-label">Internship Description *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe what the intern will work on, the team, projects, and expected impact..."
                  value={form.description}
                  onChange={set('description')}
                />
                {errors.description && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.description}</span>}
              </div>

              {/* ── Requirements ── */}
              <div className="form-group form-full">
                <label className="form-label">Candidate Requirements</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Final year student, 6+ months availability, basic knowledge of React, good communication..."
                  value={form.requirements}
                  onChange={set('requirements')}
                />
              </div>

            </div>

            {/* Footer */}
            <div className="form-footer">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : initial ? 'Save Changes' : 'Post Internship'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}