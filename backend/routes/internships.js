const express      = require('express')
const Internship   = require('../models/Internship')
const { protectCompany } = require('../middleware/Authmiddleware')
const router       = express.Router()

router.get('/', protectCompany, async (req, res) => {
  try {
    const internships = await Internship
      .find({ company: req.company._id })
      .sort({ createdAt: -1 })
    res.json(internships)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protectCompany, async (req, res) => {
  try {
    const {
      title, role, type, stipend, salary,
      duration, openings, skills, description, requirements, status
    } = req.body

    if (!title || !role || !duration || !description)
      return res.status(400).json({ message: 'Title, role, duration and description are required' })

    const internship = await Internship.create({
      company:      req.company._id,
      companyName:  req.company.name,
      title, role, type, stipend,
      salary:       stipend === 'paid' ? Number(salary) : 0,
      duration,
      openings:     Number(openings) || 1,
      skills:       Array.isArray(skills) ? skills : [],
      description,
      requirements: requirements || '',
      status:       status || 'active',
    })

    console.log(' Internship created:', internship.title, 'by', req.company.name)
    res.status(201).json(internship)
  } catch (err) {
    console.error(' Create internship error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', protectCompany, async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id:     req.params.id,
      company: req.company._id
    })
    if (!internship)
      return res.status(404).json({ message: 'Internship not found' })

    const updates = { ...req.body }
    if (updates.stipend === 'unpaid') updates.salary   = 0
    if (updates.salary)               updates.salary   = Number(updates.salary)
    if (updates.openings)             updates.openings = Number(updates.openings)

    const updated = await Internship.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', protectCompany, async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id:     req.params.id,
      company: req.company._id
    })
    if (!internship)
      return res.status(404).json({ message: 'Internship not found' })

    await Internship.findByIdAndDelete(req.params.id)
    res.json({ message: 'Internship deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router