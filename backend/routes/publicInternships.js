const express    = require('express')
const Internship = require('../models/Internship')
const router     = express.Router()

router.get('/public', async (req, res) => {
  try {
    const { search, type, stipend } = req.query

    const query = { status: 'active' }

    if (type    && type    !== 'all') query.type    = type
    if (stipend && stipend !== 'all') query.stipend = stipend
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skills:      { $elemMatch: { $regex: search, $options: 'i' } } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const internships = await Internship.find(query).sort({ createdAt: -1 })
    res.json(internships)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/public/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
    if (!internship)
      return res.status(404).json({ message: 'Internship not found' })
    res.json(internship)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router