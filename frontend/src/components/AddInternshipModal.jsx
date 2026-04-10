import { useState } from 'react'

export default function AddInternshipModal({ initial, onClose, onSave, orgName }) {
  const [form, setForm] = useState({
    title:       initial?.title       || '',
    company:     initial?.company     || orgName || '',
    role:        initial?.role        || '',
    type:        initial?.type        || 'remote',
    stipend:     initial?.stipend     || 'paid',
    salary:      initial?.salary      || '',
    duration:    initial?.duration    || '',
    openings:    initial?.openings    || 1,
    description: initial?.description || '',
    requirements:initial?.requirements|| '',
    status:      initial?.status      || 'active',
    skills:      initial?.skills      || [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors]         = useState({})

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const s = skillInput.trim().replace(',', '')
      if (s && !form.skills.includes(s)) {
        setForm(f => ({ ...f, skills: [...f.skills, s] }))
      }
      setSkillInput('')
    }
  }

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Required'
    if (!form.company.trim())  e.company  = 'Required'
    if (!form.role.trim())     e.role     = 'Required'
    if (!form.duration.trim()) e.duration = 'Required'
    if (form.stipend === 'paid' && !form.salary) e.salary = 'Required for paid internship'
    if (!form.description.trim()) e.description = 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, salary: form.stipend === 'paid' ? Number(form.salary) : 0, openings: Number(form.openings) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Edit Internship' : 'Post New Internship'}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* Title */}
              <div className="form-group form-full">
                <label className="form-label">Internship Title *</label>
                <input className="form-input" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={set('title')} />
                {errors.title && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.title}</span>}
              </div>

              {/* Company */}
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input className="form-input" placeholder="Your company name" value={form.company} onChange={set('company')} />
                {errors.company && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.company}</span>}
              </div>

              {/* Role / Department */}
              <div className="form-group">
                <label className="form-label">Role / Department *</label>
                <input className="form-input" placeholder="e.g. Engineering, Design, Marketing" value={form.role} onChange={set('role')} />
                {errors.role && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.role}</span>}
              </div>

              <hr className="form-divider" />

              {/* Internship Type */}
              <div className="form-group form-full">
                <label className="form-label">Internship Type *</label>
                <div className="radio-group">
                  {['remote', 'onsite', 'hybrid'].map(t => (
                    <label key={t} className={`radio-option ${form.type === t ? 'selected' : ''}`}>
                      <input type="radio" name="type" value={t} checked={form.type === t} onChange={set('type')} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Stipend */}
              <div className="form-group form-full">
                <label className="form-label">Stipend *</label>
                <div className="radio-group">
                  <label className={`radio-option ${form.stipend === 'paid' ? 'selected' : ''}`}>
                    <input type="radio" name="stipend" value="paid" checked={form.stipend === 'paid'} onChange={set('stipend')} />
                    💰 Paid
                  </label>
                  <label className={`radio-option ${form.stipend === 'unpaid' ? 'selected' : ''}`}>
                    <input type="radio" name="stipend" value="unpaid" checked={form.stipend === 'unpaid'} onChange={set('stipend')} />
                    🎓 Unpaid / Certificate
                  </label>
                </div>
              </div>

              {/* Salary (conditional) */}
              {form.stipend === 'paid' && (
                <div className="form-group">
                  <label className="form-label">Monthly Salary (₹) *</label>
                  <div className="salary-row">
                    <span className="salary-prefix">₹</span>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 15000" value={form.salary} onChange={set('salary')} style={{ flex: 1 }} />
                  </div>
                  {errors.salary && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.salary}</span>}
                </div>
              )}

              {/* Duration */}
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

              {/* Openings */}
              <div className="form-group">
                <label className="form-label">No. of Openings</label>
                <input className="form-input" type="number" min="1" value={form.openings} onChange={set('openings')} />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <hr className="form-divider" />

              {/* Skills */}
              <div className="form-group form-full">
                <label className="form-label">Required Skills</label>
                <div className="skills-tags" onClick={() => document.getElementById('skillInput').focus()}>
                  {form.skills.map(s => (
                    <span key={s} className="skill-tag-input">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))}
                  <input
                    id="skillInput"
                    className="skills-text-input"
                    placeholder={form.skills.length === 0 ? 'Type skill and press Enter...' : ''}
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                </div>
                <div className="skills-hint">Press Enter or comma to add a skill</div>
              </div>

              {/* Description */}
              <div className="form-group form-full">
                <label className="form-label">Internship Description *</label>
                <textarea className="form-textarea" rows={4} placeholder="Describe what the intern will work on, the team, the impact..." value={form.description} onChange={set('description')} />
                {errors.description && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.description}</span>}
              </div>

              {/* Requirements */}
              <div className="form-group form-full">
                <label className="form-label">Candidate Requirements</label>
                <textarea className="form-textarea" rows={3} placeholder="e.g. Final year student, basic knowledge of React, good communication skills..." value={form.requirements} onChange={set('requirements')} />
              </div>

            </div>

            <div className="form-footer">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {initial ? 'Save Changes' : 'Post Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}