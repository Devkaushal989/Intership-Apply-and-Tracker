const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const Company = require('../models/Company')
const router  = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, industry, website } = req.body
    console.log(' Company register:', { name, email })

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' })

    const existing = await Company.findOne({ email })
    if (existing)
      return res.status(400).json({ message: 'A company with this email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const company = await Company.create({
      name, email,
      password: hashedPassword,
      industry: industry || '',
      website:  website  || '',
    })

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    console.log(' Company created:', company.email)

    res.status(201).json({
      message: 'Company registered successfully',
      token,
      company: { id: company._id, name: company.name, email: company.email, industry: company.industry, website: company.website }
    })
  } catch (err) {
    console.error(' Company register error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(' Company login:', email)

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const company = await Company.findOne({ email: email.toLowerCase().trim() })
    if (!company) {
      console.log(' No company found:', email)
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, company.password)
    console.log(' Password match:', match)
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' })

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    console.log(' Company login success:', email)

    res.json({
      message: 'Login successful',
      token,
      company: { id: company._id, name: company.name, email: company.email, industry: company.industry, website: company.website }
    })
  } catch (err) {
    console.error(' Company login error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router