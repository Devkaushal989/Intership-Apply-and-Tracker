const express     = require('express')
const Application = require('../models/Application')
const { protectCandidate, protectCompany, protectAdmin } = require('../middleware/Authmiddleware')
const router      = express.Router()

// ─────────────────────────────────────────────
//  CANDIDATE ROUTES
// ─────────────────────────────────────────────

// ── POST /api/applications  →  candidate applies ──
router.post('/', protectCandidate, async (req, res) => {
  try {
    const {
      internshipId, internshipTitle, companyName,
      internshipType, stipend, salary,
      applicantName, applicantEmail, coverLetter, resumeName,
    } = req.body

    if (!internshipId || !applicantName || !applicantEmail)
      return res.status(400).json({ message: 'Missing required fields' })

    const existing = await Application.findOne({ internshipId, candidate: req.user._id })
    if (existing)
      return res.status(400).json({ message: 'You have already applied for this internship' })

    const application = await Application.create({
      internshipId, internshipTitle, companyName,
      internshipType, stipend, salary,
      candidate:     req.user._id,
      applicantName, applicantEmail,
      coverLetter:   coverLetter || '',
      resumeName:    resumeName  || '',
      status:        'applied',
      appliedAt:     new Date(),
    })

    console.log('✅ Application:', applicantEmail, '→', internshipTitle)
    res.status(201).json(application)
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You have already applied for this internship' })
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/applications/my ──
router.get('/my', protectCandidate, async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user._id }).sort({ appliedAt: -1 })
    res.json(apps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/applications/my/stats ──
router.get('/my/stats', protectCandidate, async (req, res) => {
  try {
    const all = await Application.find({ candidate: req.user._id })
    const now = new Date()
    const weekly = [0, 0, 0, 0]
    all.forEach(app => {
      const diff = Math.floor((now - new Date(app.appliedAt)) / (7 * 24 * 60 * 60 * 1000))
      if (diff >= 0 && diff < 4) weekly[3 - diff]++
    })
    res.json({
      total:       all.length,
      applied:     all.filter(a => a.status === 'applied').length,
      review:      all.filter(a => a.status === 'review').length,
      shortlisted: all.filter(a => a.status === 'shortlisted').length,
      hired:       all.filter(a => a.status === 'hired').length,
      rejected:    all.filter(a => a.status === 'rejected').length,
      inProgress:  all.filter(a => ['review', 'shortlisted'].includes(a.status)).length,
      weekly,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── DELETE /api/applications/:id  →  withdraw ──
router.delete('/:id', protectCandidate, async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, candidate: req.user._id })
    if (!app) return res.status(404).json({ message: 'Application not found' })
    if (app.status !== 'applied')
      return res.status(400).json({ message: 'Cannot withdraw after company has reviewed your application' })
    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application withdrawn successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────────
//  COMPANY ROUTES
// ─────────────────────────────────────────────

// ── GET /api/applications/company  →  all applicants for this company ──
router.get('/company', protectCompany, async (req, res) => {
  try {
    const apps = await Application
      .find({ companyName: req.company.name })
      .sort({ appliedAt: -1 })
    res.json(apps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/applications/company/:internshipId ──
router.get('/company/:internshipId', protectCompany, async (req, res) => {
  try {
    const apps = await Application
      .find({ internshipId: req.params.internshipId })
      .sort({ appliedAt: -1 })
    res.json(apps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── PUT /api/applications/:id/status  →  company updates status ──
router.put('/:id/status', protectCompany, async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['applied', 'review', 'shortlisted', 'hired', 'rejected']
    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status value' })

    const app = await Application.findById(req.params.id)
    if (!app) return res.status(404).json({ message: 'Application not found' })

    app.status = status
    await app.save()
    res.json(app)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────────
//  ADMIN ROUTES
// ─────────────────────────────────────────────

// ── GET /api/applications/admin/all  →  admin sees ALL applications ──
router.get('/admin/all', protectAdmin, async (req, res) => {
  try {
    const apps = await Application.find({}).sort({ appliedAt: -1 })
    res.json(apps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router