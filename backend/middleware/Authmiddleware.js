const jwt     = require('jsonwebtoken')
const User    = require('../models/user')
const Company = require('../models/Company')
const Admin   = require('../models/Admin')

const protectCandidate = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized, no token' })

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'Candidate not found' })
    next()
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}

const protectCompany = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized, no token' })

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.company = await Company.findById(decoded.id).select('-password')
    if (!req.company) return res.status(401).json({ message: 'Company not found' })
    next()
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}

const protectAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized, no token' })

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Admin access only' })

    req.admin = await Admin.findById(decoded.id).select('-password')
    if (!req.admin) return res.status(401).json({ message: 'Admin not found' })
    next()
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}

const protect = protectCandidate

module.exports = { protect, protectCandidate, protectCompany, protectAdmin }