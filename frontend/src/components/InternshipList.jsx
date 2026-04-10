const TYPE_COLORS = { remote: 'tag-remote', onsite: 'tag-onsite', hybrid: 'tag-hybrid' }
const AV_COLORS   = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444']

export default function InternshipList({ internships, onEdit, onDelete, onView }) {
  if (!internships.length) return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
      </div>
      <div className="empty-title">No internships yet</div>
      <div className="empty-desc">Post your first internship to start receiving applications</div>
    </div>
  )

  return (
    <div className="cards-grid">
      {internships.map((item, idx) => (
        <div className="intern-card" key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
          <div className="card-top">
            <div className="card-company">
              <div className="company-logo">{item.company.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="company-name">{item.company}</div>
                <div className="company-role">{item.role}</div>
              </div>
            </div>
            <div className="card-actions">
              <button className="card-action-btn" title="View" onClick={() => onView(item)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button className="card-action-btn" title="Edit" onClick={() => onEdit(item)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="card-action-btn del" title="Delete" onClick={() => onDelete(item.id)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>

          <div className="card-title">{item.title}</div>

          <div className="card-tags">
            <span className={`tag ${item.stipend === 'paid' ? 'tag-paid' : 'tag-unpaid'}`}>
              {item.stipend === 'paid' ? `₹${item.salary?.toLocaleString()}/mo` : 'Unpaid'}
            </span>
            <span className={`tag ${TYPE_COLORS[item.type] || 'tag-remote'}`} style={{ textTransform: 'capitalize' }}>
              {item.type}
            </span>
            {item.skills.slice(0, 2).map(s => (
              <span key={s} className="tag tag-skill">{s}</span>
            ))}
            {item.skills.length > 2 && (
              <span className="tag tag-skill">+{item.skills.length - 2}</span>
            )}
          </div>

          <div className="card-meta">
            <span className="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {item.duration}
            </span>
            <span className="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {item.openings} opening{item.openings > 1 ? 's' : ''}
            </span>
          </div>

          <p className="card-desc">{item.description}</p>

          <div className="card-footer">
            <div className="applicants-row">
              <div className="applicant-avatars">
                {Array.from({ length: Math.min(3, item.applicants) }).map((_, i) => (
                  <div key={i} className="applicant-avatar" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="applicant-count">{item.applicants} applicants</span>
            </div>
            <span className={`status-badge badge-${item.status}`} style={{ textTransform: 'capitalize' }}>
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}