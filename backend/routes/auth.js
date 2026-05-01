const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const User    = require('../models/user')
const router  = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(' Candidate register:', { name, email })

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ message: 'Email already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    console.log(' Candidate created:', user.email)
    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.error(' Register error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(' Candidate login:', email)

    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      console.log(' No user found:', email)
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    console.log(' Password match:', match)
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    console.log(' Candidate login success:', email)

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.error(' Login error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router