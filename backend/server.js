const express           = require('express')
const mongoose          = require('mongoose')
const cors              = require('cors')
const dotenv            = require('dotenv')
const authRoutes        = require('./routes/auth')
const companyAuth       = require('./routes/companyAuth')
const adminAuth         = require('./routes/adminAuth')
const internships       = require('./routes/internships')
const publicInternships = require('./routes/publicInternships')
const applications      = require('./routes/applications')

dotenv.config()

const app = express()

// ── Middleware ──
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// ── Routes ──
app.use('/api/auth',         authRoutes)           // candidate login/register
app.use('/api/company',      companyAuth)           // company login/register
app.use('/api/admin',        adminAuth)            // admin login/seed/me
app.use('/api/internships',  internships)           // company CRUD (protected)
app.use('/api/internships',  publicInternships)     // public listing (open)
app.use('/api/applications', applications)          // candidate apply + fetch

// ── Health check ──
app.get('/', (req, res) => res.json({ message: '   InternBuddy API running' }))

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log(' MongoDB Atlas Connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(` Server running on http://localhost:${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error(' MongoDB failed:', err.message)
    process.exit(1)
  })