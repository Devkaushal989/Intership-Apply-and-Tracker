const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const Admin   = require('../models/Admin')
const router  = express.Router()

const DEFAULT_ADMIN_EMAIL = 'admin@internbuddy.com'
const DEFAULT_ADMIN_PASSWORD = 'Admin@1234'

const normalizeEmail = (email) => (email || '').toLowerCase().trim()

const passwordMatches = async (plainPassword, storedPassword) => {
  if (!storedPassword) return false
  if (storedPassword.startsWith('$2')) return bcrypt.compare(plainPassword, storedPassword)
  return plainPassword === storedPassword
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(' Admin login attempt:', email)

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const admin = await Admin.findOne({ email: normalizeEmail(email) })
    if (!admin) {
      console.log(' No admin found:', email)
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const match = await passwordMatches(password, admin.password)
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' })

    if (!admin.password.startsWith('$2')) {
      admin.password = await bcrypt.hash(password, 10)
      await admin.save()
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(' Admin login success:', email)
    res.json({
      message: 'Admin login successful',
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
    })
  } catch (err) {
    console.error(' Admin login error:', err.message)
    res.status(500).json({ message: err.message })
  }
})


router.post('/seed', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
    const admin = await Admin.findOneAndUpdate(
      { email: DEFAULT_ADMIN_EMAIL },
      {
        name: 'Super Admin',
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    if (!admin)
      return res.status(500).json({ message: 'Failed to create admin account' })

    console.log(' Default admin ready')
    res.status(201).json({
      message: ' Admin created successfully',
      credentials: {
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized' })

    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Admin access only' })

    const admin   = await Admin.findById(decoded.id).select('-password')
    if (!admin) return res.status(404).json({ message: 'Admin not found' })
    res.json(admin)
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' })
  }
})

module.exports = router